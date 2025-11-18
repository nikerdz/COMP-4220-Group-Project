import { useEffect, useState } from "react";

interface BackendBook {
    isbn: string;
    categoryID: number;
    title: string;
    author: string;
    price: number;
    supplierId?: number;
    year: string;
    edition?: string;
    publisher?: string;
    inStock: number;
}

interface BookItem {
    id: string;
    title: string;
    author: string;
    category: string;
    imageUrl: string;
    shortDescription: string;
    description: string;
    price: number;
    inStock: number;
}
interface CartItem {
    book: BookItem;
    quantity: number;
}

interface BooksSectionProps {
    cart: CartItem[];
    setCart: (cart: CartItem[] | ((prev: CartItem[]) => CartItem[])) => void;
}

interface BackendCartItem {
    isbn: string;
    categoryID: number;
    title: string;
    author: string;
    price: number;
    year: string;
    inStock: number;
    publisher?: string;
    edition?: string;
    supplierId?: number;
}

// CategoryID -> label
const categoryMap: Record<number, string> = {
    1: "Classics",
    2: "Programming",
    3: "Software",
    4: "Self-Help",
    5: "Biography",
    6: "Business",
};

const categoryColors: Record<string, string> = {
    Classics: "bg-[#7A3E2E] text-[#F5EBDD]",
    Programming: "bg-[#33424E] text-[#F5EBDD]",
    Software: "bg-[#3B1F16] text-[#F5EBDD]",
    "Self-Help": "bg-[#C26B3D] text-[#F5EBDD]",
    Biography: "bg-[#8A4526] text-[#F5EBDD]",
    Business: "bg-[#241814] text-[#F5EBDD]",
    Default: "bg-[#3B1F16] text-[#F5EBDD]",
};
const coverMap: Record<string, string> = {
    Classics: "/covers/brown.webp",
    Programming: "/covers/green.jpg",
    Software: "/covers/blue.avif",
    "Self-Help": "/covers/purple.webp",
    Biography: "/covers/red-book-cover.jpg",
    Business: "/covers/blue-book-cover.webp",
    Default: "/covers/default.avif",
};

export default function BooksSection({ cart, setCart }: BooksSectionProps) {
    const [books, setBooks] = useState<BookItem[]>([]);
    const [selectedBook, setSelectedBook] = useState<BookItem | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchCart = async () => {
        try {
            const userId = 1; // Using user ID 1 for demo

            const res = await fetch(`http://localhost:5187/api/test/cart/${userId}`);

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }

            const data = await res.json();

            // Map the backend cart data to our CartItem format
            const mapped: CartItem[] = data.map((item: any) => {
                const category = categoryMap[item.categoryID] || "Default";
                const priceStr = item.price.toFixed(2);

                return {
                    book: {
                        id: item.isbn,
                        title: item.title,
                        author: item.author,
                        category,
                        imageUrl: coverMap[category] || coverMap.Default,
                        shortDescription: `Published ${item.year}. $${priceStr}. In stock: ${item.inStock}`,
                        description: `Publisher: ${item.publisher ?? "Unknown"}. Edition: ${item.edition ?? "N/A"}.`,
                        price: item.price,
                        inStock: item.inStock,
                    },
                    quantity: 1 // Your backend doesn't track quantity per item, so default to 1
                };
            });

            setCart(mapped);
        } catch (err) {
            console.error("Failed to load cart from server:", err);
        }
    };

    const addToCart = async (book: BookItem) => {
        try {
            const userId = 1; // Using user ID 1 for demo

            const response = await fetch("http://localhost:5187/api/test/cart/items", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: userId,
                    isbn: book.id,
                    categoryID: book.category, // You might need to map this back to number
                    title: book.title,
                    author: book.author,
                    price: book.price,
                    year: book.shortDescription.split(' ')[1], // Extract year from shortDescription
                    inStock: book.inStock
                })
            });

            if (!response.ok) {
                throw new Error("Failed to add to cart");
            }

            // Refresh the cart from backend after adding
            await fetchCart();

        } catch (err) {
            console.error("Failed to add to cart:", err);
        }
    };

    // Load cart when component mounts
    useEffect(() => {
        fetchCart();
    }, []);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                setError(null);

                // direct backend URL (no proxy)
                const res = await fetch("http://localhost:5187/api/test/books");

                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}`);
                }

                const data: BackendBook[] = await res.json();

                const mapped: BookItem[] = data.map((b: BackendBook) => {
                    const category = categoryMap[b.categoryID] || "Default";
                    const priceStr = b.price.toFixed(2);

                    return {
                        id: b.isbn,
                        title: b.title,
                        author: b.author,
                        category,
                        imageUrl: coverMap[category] || coverMap.Default,
                        shortDescription: `Published ${b.year}. $${priceStr}. In stock: ${b.inStock}`,
                        description: `Publisher: ${b.publisher ?? "Unknown"
                            }. Edition: ${b.edition ?? "N/A"}.`,
                        price: b.price,
                        inStock: b.inStock,
                    };
                });

                setBooks(mapped);
            } catch (err) {
                // eslint-disable-next-line no-console
                console.error(err);
                setError("Failed to load books from server.");
            }
        };

        void fetchBooks();
    }, []);

    const getCategoryClass = (category: string): string =>
        categoryColors[category] || categoryColors.Default;

    return (
        <section className="bg-white py-16 px-6">
            <h2 className="text-3xl font-semibold text-gray-800 text-center mb-8">
                Books
            </h2>

            {error && (
                <p className="text-center text-red-600 mb-4 text-sm">{error}</p>
            )}

            <div className="max-w-6xl mx-auto grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {books.map((book) => (
                    <article
                        key={book.id}
                        className="bg-white/90 rounded-2xl shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => setSelectedBook(book)}
                    >
                        <div className="h-52 overflow-hidden">
                            <img
                                src={book.imageUrl}
                                alt={book.title}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="p-4 flex flex-col flex-1">
                            <div
                                className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold mb-2 ${getCategoryClass(
                                    book.category
                                )}`}
                            >
                                {book.category}
                            </div>

                            <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                                {book.title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                                by {book.author}
                            </p>
                            <p className="text-sm text-gray-500 line-clamp-3">
                                {book.shortDescription}
                            </p>

                            <div className="mt-auto pt-4 flex items-center justify-between">
                                <span className="text-lg font-bold text-gray-900">
                                    ${book.price.toFixed(2)}
                                </span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        addToCart(book);
                                    }}
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            {selectedBook && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-2xl font-semibold text-gray-900">
                                {selectedBook.title}
                            </h3>
                            <button
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => setSelectedBook(null)}
                            >
                                ✕
                            </button>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                            by {selectedBook.author} · {selectedBook.category}
                        </p>
                        <p className="text-gray-800 mb-4">
                            {selectedBook.description}
                        </p>
                        <img
                            src={selectedBook.imageUrl}
                            alt={selectedBook.title}
                            className="w-full rounded-lg"
                        />
                        <div className="flex items-center justify-between border-t pt-4">
                            <div>
                                <span className="text-2xl font-bold text-gray-900">
                                    ${selectedBook.price.toFixed(2)}
                                </span>
                                <p className="text-sm text-gray-600">In stock: {selectedBook.inStock}</p>
                            </div>
                            <button
                                onClick={() => {
                                    addToCart(selectedBook);
                                }}
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
