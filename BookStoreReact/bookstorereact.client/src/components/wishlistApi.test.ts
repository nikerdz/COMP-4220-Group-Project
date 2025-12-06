import {
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    moveToCart,
    type WishlistItem,
} from "./wishlistApi";

describe("wishlistApi", () => {
    const sampleWishlist: WishlistItem[] = [
        {
            wishlistID: 1,
            userID: 42,
            isbn: "111",
            dateAdded: "2024-10-01T12:00:00Z",
            title: "Clean Code",
            author: "Robert C. Martin",
            price: 45.0,
        },
        {
            wishlistID: 2,
            userID: 42,
            isbn: "222",
            dateAdded: "2024-09-20T09:00:00Z",
            title: "Pride and Prejudice",
            author: "Jane Austen",
            price: 15.0,
        },
    ];

    beforeEach(() => {
        // Reset mock fetch before each test
        // @ts-expect-error - overwrite global fetch for tests
        global.fetch = vi.fn();
    });

    describe("fetchWishlist", () => {
        it("returns wishlist items when server responds with 200 OK", async () => {
            // @ts-expect-error - mocking global fetch
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => sampleWishlist,
            });

            const result = await fetchWishlist(42);

            expect(global.fetch).toHaveBeenCalledWith("/api/wishlist/42");
            expect(result).toEqual(sampleWishlist);
        });

        it("throws an error when server responds with non-OK status", async () => {
            // @ts-expect-error - mocking global fetch
            global.fetch.mockResolvedValueOnce({
                ok: false,
                status: 500,
            });

            await expect(fetchWishlist(42)).rejects.toThrow(
                /failed to load wishlist/i
            );
        });
    });

    describe("addToWishlist", () => {
        it("sends POST to /api/wishlist/add and resolves on success", async () => {
            // @ts-expect-error - mocking global fetch
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ message: "Added" }),
            });

            await addToWishlist(42, "1234567890");

            expect(global.fetch).toHaveBeenCalledWith(
                "/api/wishlist/add",
                expect.objectContaining({
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: 42, isbn: "1234567890" }),
                })
            );
        });

        it("throws a descriptive error when server returns BadRequest (duplicate or fail)", async () => {
            // This matches WishlistController: rows < 1 => BadRequest("Already exists or failed")
            // @ts-expect-error - mocking global fetch
            global.fetch.mockResolvedValueOnce({
                ok: false,
                status: 400,
                json: async () => ({ message: "Already exists or failed" }),
            });

            await expect(addToWishlist(42, "1234567890")).rejects.toThrow(
                /already exists or failed/i
            );
        });
    });

    describe("removeFromWishlist", () => {
        it("sends DELETE to /api/wishlist/remove and resolves on success", async () => {
            // @ts-expect-error - mocking global fetch
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ message: "Removed" }),
            });

            await removeFromWishlist(42, "1234567890");

            expect(global.fetch).toHaveBeenCalledWith(
                "/api/wishlist/remove",
                expect.objectContaining({
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: 42, isbn: "1234567890" }),
                })
            );
        });

        it("throws a descriptive error when server returns NotFound", async () => {
            // @ts-expect-error - mocking global fetch
            global.fetch.mockResolvedValueOnce({
                ok: false,
                status: 404,
                json: async () => ({ message: "Not found" }),
            });

            await expect(removeFromWishlist(42, "1234567890")).rejects.toThrow(
                /not found/i
            );
        });
    });

    describe("duplicate prevention (server behavior)", () => {
        it("treats backend 'duplicate' response as an error", async () => {
            global.fetch.mockResolvedValueOnce({
                ok: false,
                status: 409,
                json: async () => ({ message: "Duplicate entry" }),
            });

            await expect(addToWishlist(42, "111")).rejects.toThrow(
                /duplicate/i
            );
        });
    });

    describe("moveToCart", () => {
        it("sends POST to /api/wishlist/move and succeeds", async () => {
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ message: "Moved" }),
            });

            await moveToCart(42, "111");

            expect(global.fetch).toHaveBeenCalledWith(
                "/api/wishlist/move",
                expect.objectContaining({
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: 42, isbn: "111" }),
                })
            );
        });

        it("throws error when backend fails Move-To-Cart", async () => {
            global.fetch.mockResolvedValueOnce({
                ok: false,
                status: 400,
                json: async () => ({ message: "Move failed" }),
            });

            await expect(moveToCart(42, "111")).rejects.toThrow(/move failed/i);
        });
    });

});
