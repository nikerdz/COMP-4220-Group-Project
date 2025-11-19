import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Contact from "./pages/Contact";
import { useState } from "react";

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
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}