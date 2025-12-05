// src/pages/PaymentForm.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PaymentForm from "./PaymentForm";
import type { PaymentFormProps } from "./PaymentForm";

const sampleBook = {
    id: "1",
    title: "Test Book",
    author: "Author",
    category: "Programming",
    imageUrl: "/covers/test.jpg",
    shortDescription: "short",
    description: "desc",
    price: 10,
    inStock: 5,
};

const makeProps = (overrides: Partial<PaymentFormProps> = {}): PaymentFormProps => ({
    cart: [{ book: sampleBook, quantity: 2 }],
    subtotal: 20,
    taxes: 2.6,
    deliveryFee: 5,
    onClose: vi.fn(),
    onSuccess: vi.fn(),
    ...overrides,
});

describe("PaymentForm", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it("shows totals and number of items", () => {
        const props = makeProps({ subtotal: 30, taxes: 3.9, deliveryFee: 5 });

        render(<PaymentForm {...props} />);

        expect(screen.getByText(/2 items? in cart/i)).toBeInTheDocument();
        expect(screen.getByText(/Subtotal: \$30\.00/)).toBeInTheDocument();
        expect(screen.getByText(/Tax: \$3\.90/)).toBeInTheDocument();
        expect(screen.getByText(/Delivery fee: \$5\.00/)).toBeInTheDocument();
        expect(screen.getByText(/Total: \$38\.90/)).toBeInTheDocument();
    });

    it("shows error when fields are empty and does not call onSuccess", () => {
        const props = makeProps();
        render(<PaymentForm {...props} />);

        const payButton = screen.getByRole("button", { name: /pay now/i });
        fireEvent.click(payButton);

        expect(
            screen.getByText(/please fill in all fields/i)
        ).toBeInTheDocument();
        expect(props.onSuccess).not.toHaveBeenCalled();
    });

    it("calls onSuccess when all fields are valid and user confirms", async () => {
        const props = makeProps();
        render(<PaymentForm {...props} />);

        fireEvent.change(screen.getByPlaceholderText(/name on card/i), {
            target: { value: "Test User" },
        });
        fireEvent.change(screen.getByPlaceholderText(/card number/i), {
            target: { value: "1234567812345678" },
        });
        fireEvent.change(screen.getByPlaceholderText(/mm\/yy/i), {
            target: { value: "12/30" },
        });
        fireEvent.change(screen.getByPlaceholderText(/cvv/i), {
            target: { value: "123" },
        });
        fireEvent.change(screen.getByPlaceholderText(/email/i), {
            target: { value: "user@example.com" },
        });

        const confirmSpy = vi
            .spyOn(window, "confirm")
            .mockReturnValue(true);

        // Mock successful backend response so onSuccess is called
        // @ts-expect-error - mock global fetch
        global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ orderId: 123 }) });

        const payButton = screen.getByRole("button", { name: /pay now/i });
        fireEvent.click(payButton);

        expect(confirmSpy).toHaveBeenCalled();
        await waitFor(() => {
            expect(props.onSuccess).toHaveBeenCalledTimes(1);
        });
    });
});
