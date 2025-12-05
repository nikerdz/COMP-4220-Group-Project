/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import BooksSection from "../components/BooksSection";
import Button from "../components/Button";
import Recommendations from "../components/Recommendations";
import OutOfStock from "../components/OutOfStock";

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

interface HomeProps {
    cart: CartItem[];
    setCart: (cart: CartItem[] | ((prev: CartItem[]) => CartItem[])) => void;
}

interface UserData {
    userId: number;
    username: string;
    isManager: boolean;
    type: string;
}

export default function Home({ cart, setCart }: HomeProps) {
    // Get user data
    const getUserData = (): UserData | null => {
        try {
            const userData = localStorage.getItem("user");
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error("Error parsing user data:", error);
            return null;
        }
    };

    const user = getUserData();
    const displayName = user?.username || "Guest";

    const handleLogout = () => {
        localStorage.removeItem("user");
        window.location.href = "/";
    };

    // -----------------------------
    // Out-of-stock logic
    // -----------------------------
    const [allBooks, setAllBooks] = useState<BookItem[]>([]);
    const [outOfStockBooks, setOutOfStockBooks] = useState<BookItem[]>([]);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                // SAME endpoint used by BooksSection — adjust if different
                const res = await fetch("/api/test/books");

                if (!res.ok) throw new Error("Failed to load books");

                const data = await res.json();
                setAllBooks(data);

                // Filter for stock == 0
                setOutOfStockBooks(data.filter((b: BookItem) => b.inStock === 0));
            } catch (err) {
                console.error(err);
            }
        };

        fetchBooks();
    }, []);

    return (
        <main className="flex flex-col">
            {/* Hero Section */}
            <section
                className="relative min-h-screen bg-cover bg-center flex flex-col items-center justify-center text-center p-6"
                style={{
                    backgroundImage: "url('/bookshelf.avif')",
                }}
            >
                <div className="absolute inset-0 bg-black/50"></div>

                <div className="relative z-10 text-white">
                    <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">
                        Welcome to BiblioCart{user ? `, ${displayName}` : ""}
                    </h1>
                    <p className="text-lg mb-6 text-gray-200">
                        {user ? "Continue your reading journey" : "Discover your next great read"}
                    </p>

                    <div className="flex flex-col gap-3 items-center">
                        {user ? (
                            <>
                                <Button to="/profile" color="blue">View Profile</Button>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 rounded-lg font-medium transition text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Button to="/login" color="blue">Go to Login</Button>
                                <Button to="/register" color="green">Register</Button>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Book browsing section */}
            <BooksSection cart={cart} setCart={setCart} />

            {/* Recommendations */}
            <h2 className="text-3xl font-semibold text-gray-700 dark:text-gray-200 text-center bg-white dark:bg-slate-900 w-full py-4 transition-colors">
                Recommendations
            </h2>
            <Recommendations cart={cart} setCart={setCart} maxItems={4} />

            {/* Out of Stock */}
            <h2 className="text-3xl font-semibold text-gray-700 dark:text-gray-200 text-center bg-white dark:bg-slate-900 w-full py-4 transition-colors">
                Out of Stock
            </h2>
            <OutOfStock cart={cart} setCart={setCart} />
        </main>
    );
}
