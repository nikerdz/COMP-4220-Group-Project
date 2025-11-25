import { render, screen, waitFor } from "@testing-library/react";
import ProfileContent from "./ProfileContent";
import { describe, it, expect, vi, beforeEach } from "vitest";

describe("ProfileContent Component - White Box Testing", () => {
    beforeEach(() => {
        // Reset mocks before each test
        vi.clearAllMocks();
        // @ts-expect-error - mock global fetch for tests
        global.fetch = vi.fn();
        localStorage.clear();
    });

    describe("General Info Section", () => {


        it("should show 'Manager' role when user is a manager (line 106)", () => {
            // Arrange
            const mockUser = {
                userId: 2,
                username: "adminuser",
                isManager: true,
                type: "Admin"
            };
            localStorage.setItem("user", JSON.stringify(mockUser));

            // Act
            render(<ProfileContent activeSection="info" />);

            // Assert
            expect(screen.getByText(/manager/i)).toBeInTheDocument();
        });

        it("should display 'No user is logged in' when no user in localStorage (line 113-117)", () => {
            // Arrange - No user set

            // Act
            render(<ProfileContent activeSection="info" />);

            // Assert
            expect(screen.getByText(/no user is logged in/i)).toBeInTheDocument();
        });
    });

    describe("Order History Section - API Calls", () => {
        it("should fetch orders from API when section is 'orders' (line 66-70)", async () => {
            // Arrange
            const mockUser = { userId: 1, username: "testuser", isManager: false, type: "Customer" };
            localStorage.setItem("user", JSON.stringify(mockUser));

            const mockOrders = [
                {
                    orderId: 101,
                    orderDate: "2024-11-20T10:00:00Z",
                    totalAmount: 59.99,
                    status: "Pending",
                    itemCount: 2
                }
            ];

            // @ts-expect-error - mock fetch response
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockOrders
            });

            // Act
            render(<ProfileContent activeSection="orders" />);

            // Assert
            await waitFor(() => {
                expect(global.fetch).toHaveBeenCalledWith("/api/orders/history/1");
            });
        });



        it("should handle API error and display error message (line 77-78)", async () => {
            // Arrange
            const mockUser = { userId: 1, username: "testuser", isManager: false, type: "Customer" };
            localStorage.setItem("user", JSON.stringify(mockUser));

            // @ts-expect-error - mock failed fetch response
            global.fetch.mockResolvedValueOnce({
                ok: false,
                json: async () => ({ message: "Failed to load orders" })
            });

            // Act
            render(<ProfileContent activeSection="orders" />);

            // Assert
            await waitFor(() => {
                expect(screen.getByText(/failed to load orders/i)).toBeInTheDocument();
            });
        });

        it("should handle network error on fetch failure (line 77-78)", async () => {
            // Arrange
            const mockUser = { userId: 1, username: "testuser", isManager: false, type: "Customer" };
            localStorage.setItem("user", JSON.stringify(mockUser));

            // @ts-expect-error - mock fetch rejection
            global.fetch.mockRejectedValueOnce(new Error("Network error"));

            // Act
            render(<ProfileContent activeSection="orders" />);

            // Assert
            await waitFor(() => {
                expect(screen.getByText(/network error|something went wrong/i)).toBeInTheDocument();
            });
        });
    });

    describe("Empty State - Order History", () => {
        it("should display 'no orders' message when user has no orders (line 146-149)", async () => {
            // Arrange
            const mockUser = { userId: 1, username: "testuser", isManager: false, type: "Customer" };
            localStorage.setItem("user", JSON.stringify(mockUser));

            const emptyOrders: any[] = [];

            // @ts-expect-error - mock fetch response with empty array
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => emptyOrders
            });

            // Act
            render(<ProfileContent activeSection="orders" />);

            // Assert
            await waitFor(() => {
                expect(screen.getByText(/you do not have any orders yet/i)).toBeInTheDocument();
            });
        });
    });

    describe("Loading State", () => {
        it("should display loading message while fetching data (line 131-133)", async () => {
            // Arrange
            const mockUser = { userId: 1, username: "testuser", isManager: false, type: "Customer" };
            localStorage.setItem("user", JSON.stringify(mockUser));

            // Create a promise that we can control
            let resolvePromise: (value: any) => void;
            const fetchPromise = new Promise((resolve) => {
                resolvePromise = resolve;
            });

            // @ts-expect-error - mock fetch with delayed response
            global.fetch.mockReturnValueOnce(fetchPromise);

            // Act
            render(<ProfileContent activeSection="orders" />);

            // Assert - Should show loading immediately
            expect(screen.getByText(/loading/i)).toBeInTheDocument();

            // Resolve the promise to prevent hanging test
            resolvePromise!({
                ok: true,
                json: async () => []
            });
        });
    });

    describe("User Authentication - No User Logged In", () => {
        it("should show 'no user logged in' for orders when not authenticated (line 123-128)", async () => {
            // Arrange - No user in localStorage

            // Act
            render(<ProfileContent activeSection="orders" />);

            // Assert
            await waitFor(() => {
                expect(screen.getByText(/no user is logged in/i)).toBeInTheDocument();
            });
        });

        it("should NOT fetch data when user is not logged in (line 58)", async () => {
            // Arrange - No user in localStorage

            // Act
            render(<ProfileContent activeSection="orders" />);

            // Assert
            await waitFor(() => {
                expect(global.fetch).not.toHaveBeenCalled();
            });
        });
    });

    describe("Section Switching - useEffect Dependency", () => {
        it("should NOT fetch data when activeSection is 'info' (line 59)", () => {
            // Arrange
            const mockUser = { userId: 1, username: "testuser", isManager: false, type: "Customer" };
            localStorage.setItem("user", JSON.stringify(mockUser));

            // Act
            render(<ProfileContent activeSection="info" />);

            // Assert - fetch should not be called for 'info' section
            expect(global.fetch).not.toHaveBeenCalled();
        });

        it("should re-fetch data when activeSection changes (line 84)", async () => {
            // Arrange
            const mockUser = { userId: 1, username: "testuser", isManager: false, type: "Customer" };
            localStorage.setItem("user", JSON.stringify(mockUser));

            // @ts-expect-error - mock fetch response
            global.fetch.mockResolvedValue({
                ok: true,
                json: async () => []
            });

            const { rerender } = render(<ProfileContent activeSection="orders" />);

            await waitFor(() => {
                expect(global.fetch).toHaveBeenCalledWith("/api/orders/history/1");
            });

            // Act - Change section to wishlist
            rerender(<ProfileContent activeSection="wishlist" />);

            // Assert - Should fetch wishlist now
            await waitFor(() => {
                expect(global.fetch).toHaveBeenCalledWith("/api/test/wishlist/1");
            });
        });
    });

    describe("Edge Cases", () => {
        it("should handle invalid JSON in localStorage gracefully (line 44-53)", () => {
            // Arrange - Set invalid JSON in localStorage
            localStorage.setItem("user", "invalid-json");

            // Act
            render(<ProfileContent activeSection="info" />);

            // Assert - Should not crash, should show no user
            expect(screen.getByText(/no user is logged in/i)).toBeInTheDocument();
        });

    });
});
