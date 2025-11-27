import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { mapBackendToBookItem, type BookItem, categoryColors } from "./booksMapper";
import { getWishlist, addToWishlist, removeFromWishlist } from "../services/wishlistService";

type CartItem = { book: BookItem; quantity: number; };
type RecommendationsProps = { cart: CartItem[]; setCart?: Dispatch<SetStateAction<CartItem[]>>; addToCart?: (book: BookItem) => void; userId?: number; maxItems?: number; };

function normId(id?: string) {
    return (id ?? "").trim();
}

export default function Recommendations({ cart, setCart, addToCart, userId, maxItems = 4 }: RecommendationsProps) {
    const [books, setBooks] = useState<BookItem[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [wishlistedIds, setWishlistedIds] = useState<Set<string>>(new Set());
    const [selectedBook, setSelectedBook] = useState<BookItem | null>(null);

    useEffect(() => {
        const fetchRecs = async () => {
            try {
                setError(null);
                const res = typeof userId === "number"
                    ? await fetch(`/api/test/recommendations/${userId}?limit=${maxItems}`)
                    : await fetch("/api/test/books");

                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = (await res.json()) as unknown[];
                setBooks(data.map(d => mapBackendToBookItem(d)));
                setError(null);
            } catch (err) {
                console.error(err);
                setBooks([]);
                setError("Failed to load books for recommendations.");
                return;
            }

            // read user from localStorage here (no external 'user' dependency)
            try {
                const stored = localStorage.getItem("user");
                const localUser = stored ? JSON.parse(stored) as { userId?: number } : null;
                const realUser = localUser ?? (userId ? { userId } : null);
                if (realUser?.userId) {
                    const w = await getWishlist(realUser.userId);
                    setWishlistedIds(new Set(w.map(b => normId(b.isbn))));
                }
            } catch (wlErr) {
                console.warn('[Recommendations] wishlist fetch failed', wlErr);
            }
        };

        void fetchRecs();
    }, [userId, maxItems]);

    const toggleWishlist = async (book: BookItem, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        // read local user here to avoid relying on an outer `user` variable
        const stored = localStorage.getItem("user");
        const localUser = stored ? JSON.parse(stored) as { userId?: number } : null;
        const realUser = localUser ?? (userId ? { userId } : null);
        if (!realUser?.userId) {
            window.location.href = "/login";
            return;
        }
        const id = normId(book.id);
        try {
            if (wishlistedIds.has(id)) {
                await removeFromWishlist(realUser.userId, id);
                console.log('[Recommendations] removed from wishlist:', id);
                setWishlistedIds(prev => {
                    const s = new Set(prev);
                    s.delete(id);
                    return s;
                });
            } else {
                await addToWishlist(realUser.userId, id);
                console.log('[Recommendations] added to wishlist:', id);
                setWishlistedIds(prev => {
                    const s = new Set(prev);
                    s.add(id);
                    return s;
                });
            }
        } catch (err) {
            console.error(err);
        }
    };

    const addToCartInternal = (book: BookItem, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (addToCart) { addToCart(book); return; }
        if (setCart) {
            setCart(prev => {
                const ex = prev.find(i => i.book.id === book.id);
                if (ex) return prev.map(i => i.book.id === book.id ? { ...i, quantity: i.quantity + 1 } : i);
                return [...prev, { book, quantity: 1 }];
            });
        }
    };

    if (!books || books.length === 0) return null;
    const showError = !!error && books.length === 0;

    const exclude = new Set((cart || []).map(ci => ci.book.id));
    const recs = books.filter(b => !exclude.has(b.id)).slice(0, maxItems);

    return (
        <section className="bg-white py-8 px-6">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recommended for you</h2>
                {showError && <p className="text-sm text-red-600 mb-2">{error}</p>}

                <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {recs.map(book => {
                        const id = normId(book.id);
                        const isWish = wishlistedIds.has(id);
                        return (
                            <article key={id}
                                onClick={() => setSelectedBook(book)}
                                className="bg-white/90 rounded-2xl shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-shadow cursor-pointer"
                            >
                                <div className="aspect-[3/4] w-full bg-[#f5f5f5] flex items-center justify-center">
                                    <img src={book.imageUrl} alt={book.title} className="max-h-full max-w-full object-contain" />
                                </div>

                                <div className="p-4 flex flex-col flex-1">
                                    <div className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold mb-2 ${categoryColors[book.category] ?? categoryColors.Default}`}>
                                        {book.category}
                                    </div>

                                    <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">{book.title}</h3>
                                    <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
                                    <p className="text-sm text-gray-500 line-clamp-3">{book.shortDescription}</p>

                                    <div className="mt-auto flex items-center justify-between pt-3">
                                        <div className="text-sm font-bold">${book.price.toFixed(2)}</div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={(e) => addToCartInternal(book, e)} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm">Add</button>
                                            <button onClick={(e) => toggleWishlist(book, e)} className={`p-2 rounded-full transition-colors ${isWish ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"}`}>
                                                <span className="text-lg">{isWish ? "♥" : "♡"}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>

                {selectedBook && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedBook(null)}>
                        <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-2xl font-semibold text-gray-900">{selectedBook.title}</h3>
                                <button className="text-gray-500 hover:text-gray-700" onClick={() => setSelectedBook(null)}>✕</button>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">by {selectedBook.author} · {selectedBook.category}</p>
                            <p className="text-sm text-gray-800 mb-4">{selectedBook.description}</p>
                            <img src={selectedBook.imageUrl} alt={selectedBook.title} className="w-full rounded-lg" />
                            <div className="flex items-center justify-between border-t pt-4">
                                <div className="text-2xl font-bold text-gray-900">${selectedBook.price.toFixed(2)}</div>
                                <div className="flex items-center gap-3">
                                    <button onClick={() => addToCartInternal(selectedBook)} className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium">Add to Cart</button>
                                    <button onClick={() => toggleWishlist(selectedBook)} className={`p-2 rounded-full transition-colors ${wishlistedIds.has(normId(selectedBook.id)) ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"}`}>{wishlistedIds.has(normId(selectedBook.id)) ? "♥" : "♡"}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}