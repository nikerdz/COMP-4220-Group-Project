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

    if (!books || books.length === 0) return null;

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
                                        <button
                                            onClick={() => {
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
                                                setTimeout(() => alert("Added to cart!"), 0);
                                            }}
                                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm"
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
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
                                    <button
                                        onClick={() => {
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
                                            setTimeout(() => alert("Added to cart!"), 0);
                                        }}
                                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm"
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}