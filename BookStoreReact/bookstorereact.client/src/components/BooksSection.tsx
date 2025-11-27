import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import {
    mapBackendToBookItem,
    filterBooks,
    type BookItem,
    type BackendBook,
} from "./booksMapper";
import { getWishlist, addToWishlist, removeFromWishlist } from "../services/wishlistService";

type CartItem = {
    book: BookItem;
    quantity: number;
};

type BooksSectionProps = {
    cart: CartItem[];
    setCart: Dispatch<SetStateAction<CartItem[]>>;
};

const categoryColors: Record<string, string> = {
    Biography: "bg-[#B8BC92] text-white",
    "Self-Help": "bg-[#C94B3B] text-white",
    Business: "bg-[#2B8B8E] text-white",
    Programming: "bg-[#C66C33] text-white",
    Software: "bg-[#7C6A52] text-white",
    Classics: "bg-[#5B3B33] text-white",
    Default: "bg-[#3B1F16] text-[#F5EBDD]",
};

function getUserFromLocalStorage() {
    try {
        const raw = localStorage.getItem("user");
        return raw ? JSON.parse(raw) as { userId: number; username: string } : null;
    } catch {
        return null;
    }
}

export default function BooksSection({ cart, setCart }: BooksSectionProps) {
    const [books, setBooks] = useState<BookItem[]>([]);
    const [selectedBook, setSelectedBook] = useState<BookItem | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [wishlistedIds, setWishlistedIds] = useState<Set<string>>(new Set());

    const user = getUserFromLocalStorage();

    const addToCart = (book: BookItem) => {
        setCart((prevCart: CartItem[]) => {
            const existingItem = prevCart.find(item => item.book.id === book.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.book.id === book.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prevCart, { book, quantity: 1 }];
            }
        });
    };

    // Load books and wishlist ids (if user)
    useEffect(() => {
        const load = async () => {
            try {
                setError(null);
                const res = await fetch("/api/test/books");
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = (await res.json()) as BackendBook[];
                setBooks(data.map(mapBackendToBookItem));

                if (user) {
                    const w = await getWishlist(user.userId) as BackendBook[];
                    setWishlistedIds(new Set(w.map(b => b.isbn)));
                }
            } catch (err) {
                console.error(err);
                setError("Failed to load books from server.");
            }
        };
        void load();
    }, []);

    const toggleWishlist = async (book: BookItem, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (!user) {
            // require login for wishlist
            window.location.href = "/login";
            return;
        }
        try {
            if (wishlistedIds.has(book.id)) {
                await removeFromWishlist(user.userId, book.id);
                setWishlistedIds(prev => {
                    const s = new Set(prev);
                    s.delete(book.id);
                    return s;
                });
            } else {
                await addToWishlist(user.userId, book.id);
                setWishlistedIds(prev => new Set(prev).add(book.id));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const getCategoryClass = (category: string): string =>
        categoryColors[category] || categoryColors.Default;

    const filteredBooks = filterBooks(books, search);

    return (
        <section className="bg-white py-8 px-6">
            <h2 className="text-3xl font-semibold text-gray-800 text-center mb-4">
                Books{cart ? ` (${cart.length})` : ""}
            </h2>

            {error && (
                <p className="text-center text-red-600 mb-4 text-sm">{error}</p>
            )}

            {/* NEW: search input */}
            <div className="max-w-6xl mx-auto mb-6">
                <input
                    type="text"
                    placeholder="Search by title, author, or category..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            {/* Grid wrapper + 'no results' state */}
            <div className="max-w-6xl mx-auto">
                {filteredBooks.length === 0 ? (
                    <p className="text-center text-gray-500 text-sm">
                        No books found.
                    </p>
                ) : (
                    <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {filteredBooks.map((book) => (
                            <article
                                key={book.id}
                                className="bg-white/90 rounded-2xl shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-shadow cursor-pointer"
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

                                    {/* Add to cart functionality */}
                                    <div className="mt-auto flex items-center justify-between pt-3">
                                        <div className="text-sm font-bold">${book.price.toFixed(2)}</div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    addToCart(book);
                                                }}
                                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm"
                                            >
                                                Add
                                            </button>

                                            <button
                                                onClick={(e) => toggleWishlist(book, e)}
                                                aria-label={wishlistedIds.has(book.id) ? "Remove from wishlist" : "Add to wishlist"}
                                                className={`p-2 rounded-full transition-colors ${wishlistedIds.has(book.id) ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"}`}
                                            >
                                                <span className="text-lg">{wishlistedIds.has(book.id) ? "♥" : "♡"}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
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
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => addToCart(selectedBook)}
                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                                >
                                    Add to Cart
                                </button>
                                <button
                                    onClick={() => toggleWishlist(selectedBook)}
                                    className={`p-2 rounded-full transition-colors ${wishlistedIds.has(selectedBook.id) ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"}`}
                                >
                                    {wishlistedIds.has(selectedBook.id) ? "♥" : "♡"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
