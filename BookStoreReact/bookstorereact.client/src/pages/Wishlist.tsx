import { useEffect, useState } from "react";
import { mapBackendToBookItem, type BookItem, type BackendBook } from "../components/booksMapper";
import { getWishlist, removeFromWishlist } from "../services/wishlistService";

interface CartItem {
    book: BookItem;
    quantity: number;
}

export default function Wishlist({ setCart }: { setCart: (cart: CartItem[] | ((prev: CartItem[]) => CartItem[])) => void }) {
    const [books, setBooks] = useState<BookItem[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<{ userId: number } | null>(null);

    function getUser() {
        try {
            const raw = localStorage.getItem("user");
            return raw ? JSON.parse(raw) as { userId: number } : null;
        } catch {
            return null;
        }
    }

    useEffect(() => {
        const u = getUser();
        setUser(u);
        if (!u) return;

        const load = async () => {
            try {
                const w = await getWishlist(u.userId) as BackendBook[];
                setBooks(w.map(mapBackendToBookItem));
            } catch (err) {
                console.error(err);
                setError("Failed to load wishlist.");
            }
        };
        void load();
    }, []);

    const moveToCart = (book: BookItem) => {
        setCart((prev: CartItem[]) => {
            const ex = prev.find(i => i.book.id === book.id);
            if (ex) return prev.map(i => i.book.id === book.id ? { ...i, quantity: i.quantity + 1 } : i);
            return [...prev, { book, quantity: 1 }];
        });
        // remove from wishlist on move
        if (user) {
            void removeFromWishlist(user.userId, book.id).then(() => {
                setBooks(prev => prev.filter(b => b.id !== book.id));
            }).catch(err => console.error(err));
        }
    };

    const remove = (book: BookItem) => {
        if (!user) return;
        void removeFromWishlist(user.userId, book.id).then(() => {
            setBooks(prev => prev.filter(b => b.id !== book.id));
        }).catch(err => console.error(err));
    };

    if (!user) return <p className="p-6">Please log in to view your wishlist.</p>;
    if (books.length === 0) return <p className="p-6">Your wishlist is empty.</p>;

    return (
        <section className="bg-white py-8 px-6">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Wishlist</h2>
                {error && <p className="text-sm text-red-600 mb-2">{error}</p>}

                <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {books.map(book => (
                        <article key={book.id} className="bg-white/90 rounded-2xl shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
                            <div className="aspect-[3/4] w-full bg-[#f5f5f5] flex items-center justify-center">
                                <img src={book.imageUrl} alt={book.title} className="max-h-full max-w-full object-contain" />
                            </div>
                            <div className="p-4 flex flex-col flex-1">
                                <div className="inline-flex px-2 py-1 rounded-full text-xs font-semibold mb-2 bg-gray-700 text-white">{book.category}</div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">{book.title}</h3>
                                <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
                                <p className="text-sm text-gray-500 line-clamp-3">{book.shortDescription}</p>

                                <div className="mt-auto flex items-center justify-between pt-3">
                                    <div className="text-sm font-bold">${book.price.toFixed(2)}</div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => moveToCart(book)} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm">Move to Cart</button>
                                        <button onClick={() => remove(book)} className="p-2 rounded-full bg-red-100 text-red-600">♥</button>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}