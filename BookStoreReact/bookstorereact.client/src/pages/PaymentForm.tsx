// src/pages/PaymentForm.tsx
import React, { useState } from "react";

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

export interface PaymentFormProps {
    cart: CartItem[];
    subtotal: number;
    taxes: number;
    deliveryFee: number;
    onClose: () => void;
    onSuccess: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
    cart,
    subtotal,
    taxes,
    deliveryFee,
    onClose,
    onSuccess,
}) => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const total = subtotal + taxes + deliveryFee;

    // form state
    const [nameOnCard, setNameOnCard] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);

    async function submitOrderToBackend() {
        const user = JSON.parse(localStorage.getItem("user") || "{}");

        const orderPayload = {
            userId: user.userId,
            email: email,
            shippingAddress: "N/A",
            paymentMethod: "Card",
            deliveryFee,
            taxRate: 0.13,
            couponCode: "",

            status: cart.some(item => item.book.inStock === 0)
                ? "PreOrder"
                : "Pending",

            items: cart.map(item => ({
                ISBN: item.book.id,
                Title: item.book.title,
                Author: item.book.author,
                Price: item.book.price,
                Quantity: item.quantity
            }))
        };

        const res = await fetch("/api/orders/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderPayload)
        });

        if (!res.ok) {
            throw new Error("Order creation failed.");
        }

        return await res.json();
    }


    const handlePayNow = async () => {
        // clear previous error
        setError(null);

        // 1) required fields check – this is what the second test cares about
        if (
            !nameOnCard.trim() ||
            !cardNumber.trim() ||
            !expiry.trim() ||
            !cvv.trim() ||
            !email.trim()
        ) {
            setError("Please fill in all fields.");
            return;
        }

        // 2) confirmation – this is what the third test spies on
        const confirmed = window.confirm(
            `Are you sure you want to place this order?\n\nTotal Amount: $${total.toFixed(
                2
            )}`
        );

        if (!confirmed) return;

        // 3) Create order in backend
        try {
            await submitOrderToBackend();
        } catch (err) {
            setError("Failed to place order. Please try again.");
            return;
        }

        window.alert(
            `Payment successful! You paid $${total.toFixed(2)}.\nYour order has been placed.`
        );

        // THEN clear & close cart
        onSuccess();
    };

    return (
        <div>
            <h2>Checkout</h2>

            <p>
                {totalItems} item{totalItems === 1 ? "" : "s"} in cart
            </p>

            <p>Subtotal: ${subtotal.toFixed(2)}</p>
            <p>Tax: ${taxes.toFixed(2)}</p>
            <p>Delivery fee: ${deliveryFee.toFixed(2)}</p>
            <p>Total: ${total.toFixed(2)}</p>

            {/* inputs that tests will target by placeholder text */}
            <div>
                <input
                    placeholder="Name on card"
                    value={nameOnCard}
                    onChange={(e) => setNameOnCard(e.target.value)}
                />
                <input
                    placeholder="Card number"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                />
                <input
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                />
                <input
                    placeholder="CVV"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                />
                <input
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            {/* error text that the tests check */}
            {error && (
                <p className="mt-2 text-sm text-red-600">
                    {error}
                </p>
            )}

            <div className="mt-6 flex justify-end gap-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={handlePayNow}
                    className="px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
                >
                    Pay now
                </button>
            </div>

        </div>
    );
};

export default PaymentForm;
