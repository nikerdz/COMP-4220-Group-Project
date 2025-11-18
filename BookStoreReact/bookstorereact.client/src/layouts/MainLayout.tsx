import { Outlet } from "react-router-dom";
import Header from "../components/Header";

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

interface MainLayoutProps {
    cart: CartItem[];
    setCart: (cart: CartItem[] | ((prev: CartItem[]) => CartItem[])) => void;
}

export default function MainLayout({ cart, setCart }: MainLayoutProps) {
    return (
        <div className="min-h-screen bg-slate-50">
            <Header cart={cart} setCart={setCart} />
            <main className="mx-auto">
                <Outlet />
            </main>
        </div>
    );
}
