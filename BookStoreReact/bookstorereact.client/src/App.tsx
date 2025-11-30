import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Contact from "./pages/Contact";
import { useState, useEffect } from "react";

//NO HEADER PAGES BELOW IMPORT
import NotFound from "./pages/NotFound";

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

export default function App() {
    const [cart, setCart] = useState<CartItem[]>([]);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const userDataStr = localStorage.getItem("user");
                if (!userDataStr) return;

                const user = JSON.parse(userDataStr);
                if (!user || !user.userId) return;

                const res = await fetch(`http://localhost:5187/api/cart/${user.userId}`);
                if (res.ok) {
                    const books = await res.json();
                    // Map backend Book model to frontend CartItem
                    const cartItems: CartItem[] = books.map((b: any) => ({
                        book: {
                            id: b.isbn,
                            title: b.title,
                            author: b.author,
                            category: "Default",
                            imageUrl: `/books/${b.title}.jpg`,
                            shortDescription: "",
                            description: "",
                            price: b.price,
                            inStock: b.inStock
                        },
                        quantity: b.quantity
                    }));
                    setCart(cartItems);
                }
            } catch (err) {
                console.error("Failed to fetch cart:", err);
            }
        };

        fetchCart();
    }, []);

    return (
        <Routes>
            {/* Routes WITH header - PASS cart props */}
            <Route element={<MainLayout cart={cart} setCart={setCart} />}>
                <Route path="/" element={<Home cart={cart} setCart={setCart} />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/contact" element={<Contact />} />
            </Route>

            {/* Routes WITHOUT header */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
