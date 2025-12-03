import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Contact from "./pages/Contact";
import { useState, useEffect } from "react";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminInventory from "./pages/AdminInventory";
import AdminCategories from "./pages/AdminCategories";
import AdminOffers from "./pages/AdminOffers";
import AdminUsers from "./pages/AdminUsers";
import AdminOrders from "./pages/AdminOrders";
import AdminSuppliers from "./pages/AdminSuppliers";

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

    // 🔥 AUTO LOGOUT ONLY WHEN TAB IS CLOSED (NOT REFRESHED)
    useEffect(() => {
        const handleVisibility = () => {
            // Page becomes hidden AND the unload event is coming from tab close
            if (document.visibilityState === "hidden") {
                // Detect if navigation type is NOT "reload"
                const perf = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;

                if (perf && perf.type !== "reload") {
                    // Tab was closed → logout
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                }
            }
        };

        document.addEventListener("visibilitychange", handleVisibility);

        return () => document.removeEventListener("visibilitychange", handleVisibility);
    }, []);

    return (
        <Routes>
            <Route element={<MainLayout cart={cart} setCart={setCart} />}>
                <Route path="/" element={<Home cart={cart} setCart={setCart} />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/contact" element={<Contact />} />
            </Route>

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="inventory" element={<AdminInventory />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="offers" element={<AdminOffers />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="suppliers" element={<AdminSuppliers />} />
            </Route>

            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
