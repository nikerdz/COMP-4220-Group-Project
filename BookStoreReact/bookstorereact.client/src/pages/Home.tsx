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

export default function Home({ cart, setCart }: HomeProps) {
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
                        Welcome to BookStore
                    </h1>
                    <p className="text-lg mb-6 text-gray-200">
                        Discover your next great read
                    </p>
                    <div className="flex flex-col gap-3 items-center">
                        <Button to="/login" color="blue">Go to Login</Button>
                        <Button to="/register" color="green">Register</Button>
                    </div>
                </div>
            </section>

            {/* PASS cart props to BooksSection */}
            <BooksSection cart={cart} setCart={setCart} />

            {/* Placeholder for Recommendation Section */}
            <section className="bg-gray-100 py-24 text-center">
                <h2 className="text-3xl font-semibold text-gray-700">Recommendations</h2>
                <p className="text-gray-500 mt-4">
                    Personalized book suggestions will appear here later.
                </p>
            </section>
        </main>
    );
}