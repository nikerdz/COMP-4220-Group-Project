import { NavLink } from "react-router-dom";
import { TablerShoppingCart } from "../icons/Cart";
import ThemeToggle from "./ThemeToggle";
import { CartOverlay } from "./CartOverlay";
import { useState } from "react";

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

interface HeaderProps {
    cart: CartItem[];
    setCart: (cart: CartItem[] | ((prev: CartItem[]) => CartItem[])) => void;
}

export default function Header({ cart, setCart }: HeaderProps) {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const getTotalItems = () => cart.reduce((total, item) => total + item.quantity, 0);

    const base = "px-3 py-1 rounded hover:bg-slate-100";
    const active = ({ isActive }: { isActive: boolean }) =>
        `${base} ${isActive ? "bg-slate-200 font-semibold" : ""}`;

    return (
        <header className="w-full border-b bg-white">
            <div className="max-w-5xl mx-auto flex items-center justify-between p-3 gap-4">
                <NavLink to="/" className="text-xl font-bold text-blue-700">
                    BookStore
                </NavLink>
                <div className="flex items-center gap-3">
                    <nav className="flex gap-2">
                        <NavLink to="/" end className={active}>
                            Home
                        </NavLink>
                        <NavLink to="/profile" className={active}>
                            Profile
                        </NavLink>
                        <NavLink to="/contact" className={active}>
                            Contact
                        </NavLink>
                    </nav>
                    <ThemeToggle />
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="p-2 rounded hover:bg-slate-100 transition-colors relative"
                        aria-label="Shopping cart"
                    >
                        <TablerShoppingCart className="w-5 h-5" />
                        {getTotalItems() > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {getTotalItems()}
                            </span>
                        )}
                    </button>
                </div>
            </div>
             {/* Cart Overlay */}
            <CartOverlay
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cart={cart}
                setCart={setCart}
            />

        </header>
    );
}
