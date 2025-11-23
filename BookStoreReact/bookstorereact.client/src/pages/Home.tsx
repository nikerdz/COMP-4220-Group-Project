import BooksSection from "../components/BooksSection";
import Button from "../components/Button";

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
    // Get user data from localStorage
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
        // Use window.location.href for full page reload to clear any state
        window.location.href = "/";
    };

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
                        Welcome to BookStore{user ? `, ${displayName}` : ""}
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

            {/* PASS cart props to BooksSection */}
            <BooksSection cart={cart} setCart={setCart} />

            {/* Placeholder for Recommendation Section */}
            <section className="bg-gray-100 py-24 text-center">
                <h2 className="text-3xl font-semibold text-gray-700">
                    {user ? "Your Recommendations" : "Recommendations"}
                </h2>
                <p className="text-gray-500 mt-4">
                    {user
                        ? "Personalized book suggestions based on your interests"
                        : "Personalized book suggestions will appear here after you login."
                    }
                </p>
            </section>
        </main>
    );
}