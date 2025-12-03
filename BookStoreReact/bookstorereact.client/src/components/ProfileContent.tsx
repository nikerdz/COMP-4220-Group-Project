"use client";

import { useEffect, useState } from "react";

type Section = "info" | "orders" | "wishlist";

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

interface ProfileContentProps {
    activeSection: Section;
    cart: CartItem[];
    setCart: (cart: CartItem[] | ((prev: CartItem[]) => CartItem[])) => void;
}

type User = {
    userId: number;
    username: string;
    isManager: boolean;
    type: string;
};

type Order = {
    orderId: number;
    orderDate: string;
    totalAmount: number;
    status: string;
    itemCount: number;
};

type WishlistItem = {
    wishlistID: number;
    userID: number;
    isbn: string;
    dateAdded: string;
    title: string;
    author: string;
    price: number;
};

export default function ProfileContent({ activeSection, cart, setCart }: ProfileContentProps) {
    const [user, setUser] = useState<User | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // use user in ls
    useEffect(() => {
        try {
            const raw = typeof window !== "undefined"
                ? localStorage.getItem("user")
                : null;
            if (!raw) return;
            setUser(JSON.parse(raw) as User);
        } catch {
            // ignore parse errors
        }
    }, []);

    // fetch orders or wishlist when section changes
    useEffect(() => {
        if (!user) return;
        if (activeSection === "info") return;

        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                if (activeSection === "orders") {
                    const res = await fetch(`/api/orders/history/${user.userId}`);
                    if (!res.ok) throw new Error("Failed to load orders.");
                    const data = await res.json();
                    // normalize orders (support PascalCase from server)
                    const normalizedOrders: Order[] = (data || []).map((o: any) => ({
                        orderId: o.orderId ?? o.OrderID ??0,
                        orderDate: o.orderDate ?? o.OrderDate ?? "",
                        totalAmount: o.totalAmount ?? o.TotalAmount ??0,
                        status: o.status ?? o.Status ?? "",
                        itemCount: o.itemCount ?? o.ItemCount ??0,
                    }));
                    setOrders(normalizedOrders);
                } else if (activeSection === "wishlist") {
                    const res = await fetch(`/api/wishlist/${user.userId}`);
                    if (!res.ok) throw new Error("Failed to load wishlist.");
                    const data = await res.json();

                    // Normalize server -> client field names (handle PascalCase and camelCase)
                    const normalized: WishlistItem[] = (data || []).map((w: any) => ({
                        wishlistID: w.wishlistID ?? w.WishlistID ?? w.WishlistId ??0,
                        userID: w.userID ?? w.UserID ?? w.UserId ??0,
                        isbn: w.isbn ?? w.ISBN ?? "",
                        dateAdded: w.dateAdded ?? w.DateAdded ?? "",
                        title: w.title ?? w.Title ?? "",
                        author: w.author ?? w.Author ?? "",
                        price: typeof w.price === "number" ? w.price : (typeof w.Price === "number" ? w.Price :0),
                    }));

                    setWishlist(normalized);
                }
            } catch (err: any) {
                setError(err.message || "Something went wrong.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [activeSection, user]);

    const removeFromWishlist = async (item: WishlistItem) => {
        const user = JSON.parse(localStorage.getItem("user")!);

        await fetch("/api/wishlist/remove", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: user.userId,
                isbn: item.isbn
            })
        });
    };

    const cancelPreOrder = async (orderId: number) => {
        const res = await fetch(`/api/orders/${orderId}/status`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "Cancelled" })
        });

        if (res.ok) {
            alert("Pre-order cancelled.");
            // refresh orders
            setOrders(prev =>
                prev.map(o =>
                    o.orderId === orderId ? { ...o, status: "Cancelled" } : o
                )
            );
        } else {
            alert("Unable to cancel pre-order.");
        }
    };



    const moveToCart = async (item: WishlistItem) => {
        const user = JSON.parse(localStorage.getItem("user")!);

        let didExist = false;

        // 1. Add to cart
        setCart(prev => {
            const existing = prev.find(p => p.book.id === item.isbn);

            if (existing) {
                didExist = true;
                return prev.map(p =>
                    p.book.id === item.isbn
                        ? { ...p, quantity: p.quantity + 1 }
                        : p
                );
            }

            const newBook = {
                id: item.isbn,
                title: item.title,
                author: item.author,
                category: "Unknown",
                imageUrl: "/covers/DEFAULT.png",
                shortDescription: "",
                description: "",
                price: item.price,
                inStock: 999
            };

            return [...prev, { book: newBook, quantity: 1 }];
        });

        // Show correct alert ONCE
        if (didExist) {
            alert("Quantity increased in cart!");
        } else {
            alert("Added to cart!");
        }

        // 2. Remove from wishlist in DB
        await fetch("/api/wishlist/remove", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: user.userId,
                isbn: item.isbn
            })
        });

        // 3. Update UI
        setWishlist(prev => prev.filter(w => w.wishlistID !== item.wishlistID));
    };

    // user info
    if (activeSection === "info") {
        return (
            <div>
                <h2 className="text-xl font-semibold text-black dark:text-gray-100 mb-2">
                    General Info
                </h2>
                {user ? (
                    <div className="space-y-1 text-sm text-black dark:text-gray-300">
                        <p>
                            <span className="font-semibold">Username:</span>{" "}
                            {user.username}
                        </p>
                        <p>
                            <span className="font-semibold">User ID:</span>{" "}
                            {user.userId}
                        </p>
                        <p>
                            <span className="font-semibold">Role:</span>{" "}
                            {user.isManager ? "Manager" : "Customer"}
                        </p>
                        <p>
                            <span className="font-semibold">Type:</span>{" "}
                            {user.type}
                        </p>
                    </div>
                ) : (
                    <p className="text-sm text-black dark:text-gray-300">
                        No user is logged in.
                    </p>
                )}
            </div>
        );
    }

    // errors / loading / no user
    if (!user) {
        return (
            <p className="text-sm text-black dark:text-gray-300">
                No user is logged in.
            </p>
        );
    }

    if (loading) {
        return <p className="text-sm text-black dark:text-gray-300">Loading...</p>;
    }

    if (error) {
        return <p className="text-sm text-red-600 dark:text-red-400">{error}</p>;
    }

    // orders tab
    if (activeSection === "orders") {
        return (
            <div>
                <h2 className="text-xl font-semibold text-black dark:text-gray-100 mb-2">
                    Order History
                </h2>
                {orders.length === 0 ? (
                    <p className="text-sm text-black dark:text-gray-300">
                        You do not have any orders yet.
                    </p>
                ) : (
                    <ul className="space-y-2 text-sm text-black dark:text-gray-300">
                        {orders.map((order) => {
                            const total = typeof order.totalAmount === 'number' ? order.totalAmount :0;
                            return (
                                <li key={order.orderId} className="border-b dark:border-slate-700 pb-1">
                                    <div>
                                        <span className="font-semibold">
                                            Order #
                                        </span>{" "}
                                        {order.orderId}
                                    </div>
                                    <div>
                                        <span className="font-semibold">
                                            Date:
                                        </span>{" "}
                                        {new Date(
                                            order.orderDate
                                        ).toLocaleString()}
                                    </div>
                                    <div>
                                        <span className="font-semibold">
                                            Status:
                                        </span>{" "}
                                        {order.status}
                                    </div>
                                    <div>
                                        <span className="font-semibold">
                                            Total:
                                        </span>{" "}
                                        ${total.toFixed(2)}
                                    </div>
                                    {order.status === "PreOrder" && (
                                        <button
                                            onClick={() => cancelPreOrder(order.orderId)}
                                            className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded-md text-xs mt-1"
                                        >
                                            Cancel Pre-Order
                                        </button>
                                    )}

                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        );
    }

    // wishlist tab
    return (
        <div>
            <h2 className="text-xl font-semibold text-black dark:text-gray-100 mb-2">
                Wishlist
            </h2>
            {wishlist.length ===0 ? (
                <p className="text-sm text-black dark:text-gray-300">Your wishlist is empty.</p>
            ) : (
                <ul className="space-y-2 text-sm text-black dark:text-gray-300">
                    {wishlist.map((item) => {
                        const price = typeof item.price === 'number' ? item.price :0;
                        return (
                            <li key={item.wishlistID} className="border-b dark:border-slate-700 pb-1">
                                <div className="font-semibold">{item.title}</div>
                                <div>by {item.author}</div>
                                <div>ISBN: {item.isbn}</div>
                                <div>Price: ${price.toFixed(2)}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    Added on {new Date(item.dateAdded).toLocaleDateString()}
                                </div>
                                <button onClick={() => moveToCart(item)} className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded-md text-xs mt-2">
                                    Move to Cart
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
