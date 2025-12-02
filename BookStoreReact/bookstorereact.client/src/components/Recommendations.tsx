import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import {
    mapBackendToBookItem,
    type BookItem,
    type BackendBook,
    categoryColors,
} from "./booksMapper";

type CartItem = {
    book: BookItem;
    quantity: number;
};

type RecommendationsProps = {
    cart: CartItem[];
    setCart?: Dispatch<SetStateAction<CartItem[]>>;
    addToCart?: (book: BookItem) => void;
    userId?: number;
    maxItems?: number;
};

export default function Recommendations({
    cart,
    setCart,
    addToCart,
    userId,
    maxItems = 4,
}: RecommendationsProps) {
    const [books, setBooks] = useState<BookItem[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [selectedBook, setSelectedBook] = useState<BookItem | null>(null);

    useEffect(() => {
        const fetchRecs = async () => {
            try {
                setError(null);

                if (typeof userId === "number") {
                    // call server endpoint via vite proxy
                    const res = await fetch(
                        `/api/test/recommendations/${userId}?limit=${maxItems}`
                    );
                    if (!res.ok) throw new Error(`HTTP ${res.status}`);
                    const data = (await res.json()) as BackendBook[];
                    setBooks(data.map(mapBackendToBookItem));
                    return;
                }

                // not logged in: fetch all books, compute locally (or show random)
                const res = await fetch("/api/test/books");
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = (await res.json()) as BackendBook[];
                setBooks(data.map(mapBackendToBookItem));
            } catch (err) {
                // eslint-disable-next-line no-console
                console.error(err);
                setError("Failed to load books for recommendations.");
            }
        };

        void fetchRecs();
    }, [userId, maxItems]);

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

    // When there are no books, still render so error messages are visible to tests / users
    if (!books || books.length === 0) {
        return (
            <section className="bg-white py-8 px-6">
                <div className="max-w-6xl mx-auto">
                    {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
                </div>
            </section>
        );
    }

    // helper to add selected book to cart using same logic as BooksSection
    const addSelectedToCart = (book: BookItem | null) => {
        if (!book) return;
        if (addToCart) {
            addToCart(book);
            return;
        }
        if (setCart) {
            setCart((prev) => {
                const existing = prev.find((i) => i.book.id === book.id);
                if (existing) {
                    return prev.map((i) =>
                        i.book.id === book.id ? { ...i, quantity: i.quantity + 1 } : i
                    );
                }
                return [...prev, { book, quantity: 1 }];
            });
        }
    };

    // guest: show random picks
    if (!cart || cart.length === 0) {
        const shuffled = [...books].sort(() => Math.random() - 0.5);
        const recs = shuffled.slice(0, maxItems);

        return (
            <section className="bg-white py-8 px-6">
                <div className="max-w-6xl mx-auto">
                    {error && <p className="text-sm text-red-600 mb-2">{error}</p>}

                    <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {recs.map((book) => (
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

                                    <div className="mt-auto flex items-center justify-between pt-3">
                                        <div className="text-sm font-bold">
                                            ${book.price.toFixed(2)}
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (addToCart) addToCart(book);
                                                    else if (setCart)
                                                        setCart((prev) => {
                                                            const existing = prev.find(
                                                                (i) => i.book.id === book.id
                                                            );
                                                            if (existing)
                                                                return prev.map((i) =>
                                                                    i.book.id === book.id
                                                                        ? { ...i, quantity: i.quantity + 1 }
                                                                        : i
                                                                );
                                                            return [...prev, { book, quantity: 1 }];
                                                        });
                                                }}
                                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm"
                                            >
                                                Add to Cart
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

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => addSelectedToCart(selectedBook)}
                                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                                        >
                                            Add to Cart
                                        </button>

                                        <button
                                            onClick={() => {
                                                void addToWishlist(selectedBook!);
                                            }}
                                            className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                            aria-label="Add to wishlist"
                                        >
                                            ♥
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        );
    }

    // cart-based recommendations (client-side)
    const counts = new Map<string, number>();
    cart.forEach((ci) =>
        counts.set(ci.book.category, (counts.get(ci.book.category) || 0) + ci.quantity)
    );
    const topCategory = Array.from(counts.entries())
        .sort((a, b) => b[1] - a[1])[0]?.[0];

    const exclude = new Set(cart.map((ci) => ci.book.id));
    const recs: BookItem[] = [];
    if (topCategory) {
        for (const b of books) {
            if (recs.length >= maxItems) break;
            if (!exclude.has(b.id) && b.category === topCategory) recs.push(b);
        }
    }
    // fill remaining with other books
    for (const b of books) {
        if (recs.length >= maxItems) break;
        if (!exclude.has(b.id) && !recs.find((r) => r.id === b.id)) recs.push(b);
    }

    if (recs.length === 0) return null;

    return (
        <section className="bg-white py-8 px-6">
            <div className="max-w-6xl mx-auto">
                {error && <p className="text-sm text-red-600 mb-2">{error}</p>}

                <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {recs.map((book) => (
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
                                <div className="inline-flex px-2 py-1 rounded-full text-xs font-semibold mb-2 text-white bg-gray-700">
                                    {book.category}
                                </div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
                                    {book.title}
                                </h3>
                                <p className="text-xs text-gray-600 mb-2">
                                    by {book.author}
                                </p>
                                <div className="mt-auto flex items-center justify-between pt-3">
                                    <div className="text-sm font-bold">
                                        ${book.price.toFixed(2)}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (addToCart) addToCart(book);
                                                else if (setCart)
                                                    setCart((prev) => {
                                                        const existing = prev.find(
                                                            (i) => i.book.id === book.id
                                                        );
                                                        if (existing)
                                                            return prev.map((i) =>
                                                                i.book.id === book.id
                                                                    ? { ...i, quantity: i.quantity + 1 }
                                                                    : i
                                                            );
                                                        return [...prev, { book, quantity: 1 }];
                                                    });
                                            }}
                                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm"
                                        >
                                            Add to Cart
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

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => addSelectedToCart(selectedBook)}
                                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                                    >
                                        Add to Cart
                                    </button>

                                    <button
                                        onClick={() => {
                                            void addToWishlist(selectedBook!);
                                        }}
                                        className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                        aria-label="Add to wishlist"
                                    >
                                        ♥
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}