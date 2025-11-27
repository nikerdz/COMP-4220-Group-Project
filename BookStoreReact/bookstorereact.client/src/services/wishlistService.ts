// call wishlist endpoints
export async function getWishlist(userId: number) {
    const res = await fetch(`/api/test/wishlist/${userId}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

export async function addToWishlist(userId: number, isbn: string) {
    const res = await fetch(`/api/test/wishlist/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ UserId: userId, ISBN: isbn }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res;
}

export async function removeFromWishlist(userId: number, isbn: string) {
    const res = await fetch(`/api/test/wishlist/items`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ UserId: userId, ISBN: isbn }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res;
}