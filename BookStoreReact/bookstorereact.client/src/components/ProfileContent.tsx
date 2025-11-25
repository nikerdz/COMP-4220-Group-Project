"use client";

import { useEffect, useState } from "react";

type Section = "info" | "orders" | "wishlist";

interface ProfileContentProps {
    activeSection: Section;
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

export default function ProfileContent({ activeSection }: ProfileContentProps) {
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
                    setOrders(data);
                } else if (activeSection === "wishlist") {
                    const res = await fetch(`/api/test/wishlist/${user.userId}`);
                    if (!res.ok) throw new Error("Failed to load wishlist.");
                    const data = await res.json();
                    setWishlist(data);
                }
            } catch (err: any) {
                setError(err.message || "Something went wrong.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [activeSection, user]);

    // user info
    if (activeSection === "info") {
        return (
            <div>
                <h2 className="text-xl font-semibold text-black mb-2">
                    General Info
                </h2>
                {user ? (
                    <div className="space-y-1 text-sm text-black">
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
                    <p className="text-sm text-black">
                        No user is logged in.
                    </p>
                )}
            </div>
        );
    }

    // errors / loading / no user
    if (!user) {
        return (
            <p className="text-sm text-black">
                No user is logged in.
            </p>
        );
    }

    if (loading) {
        return <p className="text-sm text-black">Loading...</p>;
    }

    if (error) {
        return <p className="text-sm text-red-600">{error}</p>;
    }

    // orders tab
    if (activeSection === "orders") {
        return (
            <div>
                <h2 className="text-xl font-semibold text-black mb-2">
                    Order History
                </h2>
                {orders.length === 0 ? (
                    <p className="text-sm text-black">
                        You do not have any orders yet.
                    </p>
                ) : (
                    <ul className="space-y-2 text-sm text-black">
                        {orders.map((order) => (
                            <li key={order.orderId} className="border-b pb-1">
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
                                    ${order.totalAmount.toFixed(2)}
                                </div>
                                <div>
                                    <span className="font-semibold">
                                        Items:
                                    </span>{" "}
                                    {order.itemCount}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    }

    // wishlist tab
    return (
        <div>
            <h2 className="text-xl font-semibold text-black mb-2">
                Wishlist
            </h2>
            {wishlist.length === 0 ? (
                <p className="text-sm text-black">
                    Your wishlist is empty.
                </p>
            ) : (
                <ul className="space-y-2 text-sm text-black">
                    {wishlist.map((item) => (
                        <li key={item.wishlistID} className="border-b pb-1">
                            <div className="font-semibold">{item.title}</div>
                            <div>by {item.author}</div>
                            <div>ISBN: {item.isbn}</div>
                            <div>Price: ${item.price.toFixed(2)}</div>
                            <div className="text-xs text-gray-500">
                                Added on{" "}
                                {new Date(item.dateAdded).toLocaleDateString()}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
