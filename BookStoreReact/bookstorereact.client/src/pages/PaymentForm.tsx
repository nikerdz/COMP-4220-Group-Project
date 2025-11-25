// src/pages/PaymentForm.tsx
import React from "react";

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

const PaymentForm: React.FC<PaymentFormProps> = () => {
    // MINIMAL stub – no state, no validation, no UI yet.
    return <div>Payment form stub</div>;
};

export default PaymentForm;
