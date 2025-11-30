import { TablerX } from '../icons/Close';
import { TablerShoppingCart } from '../icons/Cart';

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

interface CartOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    cart: CartItem[];
    setCart: (cart: CartItem[] | ((prev: CartItem[]) => CartItem[])) => void;
}

export function CartOverlay({ isOpen, onClose, cart, setCart }: CartOverlayProps) {
    if (!isOpen) return null;

    // Remove item from cart
    const removeFromCart = async (bookId: string) => {
        const itemToRemove = cart.find(item => item.book.id === bookId);
        setCart(cart.filter(item => item.book.id !== bookId));

        if (itemToRemove) {
            try {
                const userDataStr = localStorage.getItem("user");
                if (userDataStr) {
                    const user = JSON.parse(userDataStr);
                    if (user && user.userId) {
                        await fetch("http://localhost:5187/api/cart/remove", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                userId: user.userId,
                                isbn: bookId,
                                quantity: itemToRemove.quantity
                            })
                        });
                    }
                }
            } catch (err) {
                console.error("Failed to remove from cart backend:", err);
            }
        }
    };

    // Update quantity
    const updateQuantity = async (bookId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(bookId);
            return;
        }
        setCart(cart.map(item =>
            item.book.id === bookId ? { ...item, quantity } : item
        ));

        try {
            const userDataStr = localStorage.getItem("user");
            if (userDataStr) {
                const user = JSON.parse(userDataStr);
                if (user && user.userId) {
                    await fetch("http://localhost:5187/api/cart/update", {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            userId: user.userId,
                            isbn: bookId,
                            quantity: quantity
                        })
                    });
                }
            }
        } catch (err) {
            console.error("Failed to update cart backend:", err);
        }
    };

    // Calculate totals
    const getTotalItems = () => cart.reduce((total, item) => total + item.quantity, 0);
    const getTotalPrice = () => cart.reduce((total, item) => total + (item.book.price * item.quantity), 0);
    const getItemTotal = (item: CartItem) => item.book.price * item.quantity;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={onClose}
        >
            <div className="absolute inset-0 bg-black/30" />

            <div
                className="relative w-[60%] h-[85vh] bg-white rounded-2xl shadow-2xl flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b shrink-0">
                    <h2 className="text-2xl font-semibold text-gray-900">
                        Shopping Cart ({getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'})
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Close cart"
                    >
                        <TablerX className="h-6 w-6" />
                    </button>
                </div>

                {/* Cart Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <TablerShoppingCart className="h-24 w-24 mb-4 text-gray-300" />
                            <p className="text-lg mb-2">Your cart is empty</p>
                            <p className="text-sm text-gray-400 text-center">
                                Start shopping to add items to your cart
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cart.map((item) => (
                                <div key={item.book.id} className="flex items-center gap-4 p-4 border rounded-lg">
                                    <img
                                        src={item.book.imageUrl}
                                        alt={item.book.title}
                                        className="w-16 h-20 object-cover rounded"
                                    />
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900">{item.book.title}</h4>
                                        <p className="text-sm text-gray-600">by {item.book.author}</p>
                                        <p className="text-sm text-gray-500">${item.book.price.toFixed(2)} each</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => updateQuantity(item.book.id, item.quantity - 1)}
                                            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                                        >
                                            −
                                        </button>
                                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.book.id, item.quantity + 1)}
                                            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                                        >
                                            +
                                        </button>
                                    </div>
                                    {/* Item Total on the right */}
                                    <div className="text-right min-w-[100px]">
                                        <p className="text-lg font-bold text-gray-900">
                                            ${getItemTotal(item).toFixed(2)}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.book.id)}
                                        className="text-red-500 hover:text-red-700 p-2"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer with Total and Checkout */}
                {cart.length > 0 && (
                    <div className="border-t p-6 shrink-0">
                        <div className="space-y-4">
                            {/* Final Subtotal on the right */}
                            <div className="flex justify-between items-center">
                                <span className="text-lg text-gray-600">Subtotal</span>
                                <span className="text-xl font-bold text-gray-900">
                                    ${getTotalPrice().toFixed(2)}
                                </span>
                            </div>

                            {/* Shipping notice on the left */}
                            <p className="text-xs text-gray-500 text-left">
                                Shipping and taxes calculated at checkout
                            </p>

                            {/* Checkout button full width */}
                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors">
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}