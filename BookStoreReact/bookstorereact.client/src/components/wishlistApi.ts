export interface WishlistItem {
    wishlistID: number;
    userID: number;
    isbn: string;
    dateAdded: string;
    title: string;
    author: string;
    price: number;
}

export async function fetchWishlist(userId: number): Promise<WishlistItem[]> {
    const res = await fetch(`/api/wishlist/${userId}`);
    if (!res.ok) {
        throw new Error(`Failed to load wishlist for user ${userId}`);
    }
    return res.json();
}

export async function addToWishlist(userId: number, isbn: string): Promise<void> {
    const res = await fetch("/api/wishlist/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, isbn }),
    });

    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message ?? "Failed to add to wishlist");
    }
}

export async function removeFromWishlist(userId: number, isbn: string): Promise<void> {
    const res = await fetch("/api/wishlist/remove", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, isbn }),
    });

    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message ?? "Failed to remove from wishlist");
    }
}
