import { TablerX } from '../icons/Close';
import { TablerShoppingCart } from '../icons/Cart';
import PaymentForm from '../pages/PaymentForm';
import { useState } from 'react';

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
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    // Coupon State
    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountRate: number; description: string } | null>(null);
    const [couponMessage, setCouponMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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

    // Calculate totals helper (hoisted or defined before use)
    const getSubtotal = () => cart.reduce((total, item) => total + (item.book.price * item.quantity), 0);

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;

        try {
            const payload = {
                couponCode: couponCode,
                subtotal: getSubtotal(),
                items: cart.map(item => ({
                    isbn: item.book.id,
                    title: item.book.title,
                    author: item.book.author,
                    category: item.book.category,
                    price: item.book.price,
                    quantity: item.quantity
                }))
            };

            const response = await fetch("http://localhost:5187/api/orders/validate-coupon", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setAppliedCoupon({
                    code: data.code,
                    discountRate: data.discountRate,
                    description: data.description
                });
                setCouponMessage({ type: 'success', text: `Coupon applied: ${data.description}` });
            } else {
                setAppliedCoupon(null);
                setCouponMessage({ type: 'error', text: `${data.message} ${data.detail ? '(' + data.detail + ')' : ''}` || "Invalid coupon" });
            }
        } catch (err) {
            console.error("Error applying coupon:", err);
            setCouponMessage({ type: 'error', text: "Failed to apply coupon. Please try again." });
        }
    };

    // Calculate totals
    const getTotalItems = () => cart.reduce((total, item) => total + item.quantity, 0);

    const getDiscountAmount = () => {
        if (!appliedCoupon) return 0;
        return getSubtotal() * appliedCoupon.discountRate;
    };

    const getFinalTotal = () => {
        return getSubtotal() - getDiscountAmount();
    };

    const getItemTotal = (item: CartItem) => item.book.price * item.quantity;
    const subtotal = getSubtotal();

    const TAX_RATE = 0.13;
    const taxes = subtotal * TAX_RATE;

    const deliveryFee = cart.length > 0 ? 5 : 0;

    function proceedToCheckout() {
        setIsCheckoutOpen(true);
    }


    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={onClose}
        >
            <div className="absolute inset-0 bg-black/30" />

            <div
                className="relative w-[60%] h-[85vh] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl flex flex-col transition-colors"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b dark:border-slate-700 shrink-0">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                        Shopping Cart ({getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'})
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors dark:text-gray-200"
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
                                <div key={item.book.id} className="flex items-center gap-4 p-4 border dark:border-slate-700 rounded-lg">
                                    <img
                                        src={item.book.imageUrl}
                                        alt={item.book.title}
                                        className="w-16 h-20 object-cover rounded"
                                    />
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                            {item.book.title}
                                            {item.book.inStock === 0 && (
                                                <span className="ml-2 text-xs text-yellow-600 font-medium">
                                                    (Pre-Order)
                                                </span>
                                            )}
                                        </h4>

                                        <p className="text-sm text-gray-600 dark:text-gray-300">by {item.book.author}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">${item.book.price.toFixed(2)} each</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => updateQuantity(item.book.id, item.quantity - 1)}
                                            className="w-8 h-8 rounded-full bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 flex items-center justify-center dark:text-white"
                                        >
                                            −
                                        </button>
                                        <span className="w-8 text-center font-medium dark:text-gray-200">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.book.id, item.quantity + 1)}
                                            className="w-8 h-8 rounded-full bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 flex items-center justify-center dark:text-white"
                                        >
                                            +
                                        </button>
                                    </div>
                                    {/* Item Total on the right */}
                                    <div className="text-right min-w-[100px]">
                                        <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
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
                    <div className="border-t dark:border-slate-700 p-6 shrink-0">
                        <div className="space-y-4">
                            {/* Coupon Section */}
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Coupon Code"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                    className="flex-1 border dark:border-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                                />
                                <button
                                    onClick={handleApplyCoupon}
                                    className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    Apply
                                </button>
                            </div>
                            {couponMessage && (
                                <p className={`text-sm ${couponMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                    {couponMessage.text}
                                </p>
                            )}

                            {/* Totals */}
                            <div className="space-y-2 pt-2 border-t dark:border-slate-700">
                                <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                                    <span>Subtotal</span>
                                    <span>${getSubtotal().toFixed(2)}</span>
                                </div>
                                {appliedCoupon && (
                                    <div className="flex justify-between items-center text-green-600">
                                        <span>Discount ({appliedCoupon.code})</span>
                                        <span>-${getDiscountAmount().toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center text-xl font-bold text-gray-900 dark:text-gray-100 pt-2 border-t dark:border-slate-700">
                                    <span>Total</span>
                                    <span>${getFinalTotal().toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Shipping notice on the left */}
                            <p className="text-xs text-gray-500 dark:text-gray-400 text-left">
                                Shipping and taxes calculated at checkout
                            </p>

                            {/* Checkout button full width */}
                            <button
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
                                onClick={proceedToCheckout}
                            >
                                Proceed to Checkout
                            </button>
                            {isCheckoutOpen && (
                                <PaymentForm
                                    cart={cart}
                                    subtotal={subtotal}
                                    taxes={taxes}
                                    deliveryFee={deliveryFee}
                                    onClose={() => setIsCheckoutOpen(false)}
                                    onSuccess={() => {
                                        // When payment is confirmed:
                                        setCart([]);          // clear cart
                                        setIsCheckoutOpen(false);
                                        onClose();            // close entire overlay
                                    }}
                                />
                            )}

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}