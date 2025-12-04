import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import {
    mapBackendToBookItem,
    type BookItem,
    type BackendBook,
    categoryColors,
} from "./booksMapper";
import BookOverlay from "./BookOverlay";

type CartItem = {
    book: BookItem;
    quantity: number;
};

type OutOfStockProps = {
    cart: CartItem[];
    setCart?: Dispatch<SetStateAction<CartItem[]>>;
    addToCart?: (book: BookItem) => void;
    maxItems?: number;
};

export default function OutOfStock({
    cart,
    setCart,
    addToCart,
    maxItems = 4,
}: OutOfStockProps) {
    const [books, setBooks] = useState<BookItem[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [selectedBook, setSelectedBook] = useState<BookItem | null>(null);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                setError(null);

                const res = await fetch("/api/test/books");
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = (await res.json()) as BackendBook[];

                const mapped = data.map(mapBackendToBookItem);

                const out = mapped.filter((b) => b.inStock === 0);

                setBooks(out);
            } catch (err) {
                console.error(err);
                setError("Failed to load out-of-stock books.");
            }
        };

        void fetchBooks();
    }, []);

    if (!books || books.length === 0) return null;

    const getCategoryClass = (category: string) =>
        categoryColors[category] || categoryColors.Default;

    const addToWishlist = async (book: BookItem) => {
        if (!localStorage.getItem("user")) {
            alert("You must log in first.");
            return;
        }

        const user = JSON.parse(localStorage.getItem("user")!);

        const res = await fetch("/api/wishlist/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.userId, ISBN: book.id }),
        });

        if (res.ok) {
            alert("Added to wishlist!");
        } else {
            alert("Already in wishlist or failed.");
        }
    };

    const handlePreOrderAdd = (book: BookItem) => {
        // fire alert ONCE outside React state updates
        setTimeout(() => alert("Pre-order added!"), 0);

        if (addToCart) addToCart(book);
        else if (setCart)
            setCart((prev) => {
                const existing = prev.find((i) => i.book.id === book.id);
                if (existing)
                    return prev.map((i) =>
                        i.book.id === book.id
                            ? { ...i, quantity: i.quantity + 1 }
                            : i
                    );
                return [...prev, { book, quantity: 1 }];
            });
    };

    return (
        <section className="bg-white dark:bg-slate-900 py-8 px-6 transition-colors">
            <div className="max-w-6xl mx-auto">
                {error && <p className="text-sm text-red-600 mb-2">{error}</p>}

                <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {books.map((book) => (
                        <article
                            key={book.id}
                            className="bg-white/90 dark:bg-slate-800 rounded-2xl shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-all cursor-pointer"
                            onClick={() => setSelectedBook(book)}
                        >
                            <div className="aspect-[3/4] w-full bg-[#f5f5f5] flex items-center justify-center">
                                <img
                                    src={book.imageUrl}
                                    alt={book.title}
                                    className="max-h-full max-w-full object-contain"
                                />
                            </div>

                            <div className="p-4 flex flex-col flex-1">
                                <div
                                    className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold mb-2 text-white bg-red-700`}
                                >
                                    Out of Stock
                                </div>

                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1 line-clamp-2">
                                    {book.title}
                                </h3>

                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                                    by {book.author}
                                </p>

                                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3">
                                    {book.shortDescription}
                                </p>

                                <div className="mt-auto flex items-center justify-between pt-3">
                                    <div className="text-sm font-bold dark:text-gray-100">
                                        ${book.price.toFixed(2)}
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handlePreOrderAdd(book);
                                            }}
                                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm"
                                        >
                                            Pre-Order
                                        </button>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                void addToWishlist(book);
                                            }}
                                            className="bg-pink-600 hover:bg-pink-700 text-white px-3 py-1 rounded-lg text-sm"
                                            aria-label="Add to wishlist"
                                        >
                                            ♥
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {selectedBook && (
                    <BookOverlay
                        book={selectedBook}
                        onClose={() => setSelectedBook(null)}
                        onAddToCart={(b) => {
                            // ensure we add as pre-order
                            handlePreOrderAdd(b);
                            setSelectedBook(null);
                        }}
                        onAddToWishlist={(b) => {
                            void addToWishlist(b);
                        }}
                    />
                )}
            </div>
        </section>
    );
}
