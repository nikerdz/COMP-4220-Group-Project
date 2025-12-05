import { render, screen, fireEvent } from '@testing-library/react';

import { CartOverlay } from './CartOverlay';

vi.mock('../pages/PaymentForm', () => ({

    __esModule: true,

    default: () => <div data-testid="payment-form-mock">Payment Form</div>,

}));

global.fetch = vi.fn();

const book = {

    id: '123',

    title: 'Clean Code',

    author: 'Robert C. Martin',

    category: 'Programming',

    imageUrl: '',

    shortDescription: '',

    description: '',

    price: 50.0,

    inStock: 10,

};

const cart = [{ book, quantity: 2 }];

const setCart = vi.fn();

const onClose = vi.fn();

beforeEach(() => {

    vi.clearAllMocks();

    localStorage.clear();

    (global.fetch as ReturnType<typeof vi.fn>).mockReset();

});

describe('CartOverlay', () => {

    it('shows empty cart message when cart is empty', () => {

        render(<CartOverlay isOpen={true} onClose={onClose} cart={[]} setCart={setCart} />);

        expect(screen.getByText(/Your cart is empty/i)).toBeInTheDocument();

    });

    it('displays cart items and correct subtotal', () => {

        render(<CartOverlay isOpen={true} onClose={onClose} cart={cart} setCart={setCart} />);

        expect(screen.getByText('Clean Code')).toBeInTheDocument();

        expect(screen.getAllByText('$100.00')).toHaveLength(3);

    });

    it('increases quantity when + button is clicked', () => {

        render(<CartOverlay isOpen={true} onClose={onClose} cart={cart} setCart={setCart} />);

        fireEvent.click(screen.getAllByText('+')[0]);

        expect(setCart).toHaveBeenCalledWith([{ book, quantity: 3 }]);

    });

    it('decreases quantity when minus button is clicked', () => {

        render(<CartOverlay isOpen={true} onClose={onClose} cart={cart} setCart={setCart} />);

        fireEvent.click(screen.getAllByText('−')[0]);

        expect(setCart).toHaveBeenCalledWith([{ book, quantity: 1 }]);

    });

    it('removes item when X button is clicked', () => {

        render(<CartOverlay isOpen={true} onClose={onClose} cart={cart} setCart={setCart} />);

        // This is the exact character in your JSX: ✕ (U+2715)

        const removeButton = screen.getByText('✕');

        fireEvent.click(removeButton);

        expect(setCart).toHaveBeenCalledWith([]);

    });

    it('applies valid coupon and shows discount', async () => {

        (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({

            ok: true,

            json: async () => ({

                success: true,

                code: 'SAVE20',

                discountRate: 0.2,

                description: '20% off',

            }),

        });

        render(<CartOverlay isOpen={true} onClose={onClose} cart={cart} setCart={setCart} />);

        fireEvent.change(screen.getByPlaceholderText('Coupon Code'), { target: { value: 'SAVE20' } });

        fireEvent.click(screen.getByText('Apply'));

        await screen.findByText(/Coupon applied/i);

    });

    it('shows error for invalid coupon', async () => {

        (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({

            ok: false,

            json: async () => ({ message: 'Invalid coupon' }),

        });

        render(<CartOverlay isOpen={true} onClose={onClose} cart={cart} setCart={setCart} />);

        fireEvent.change(screen.getByPlaceholderText('Coupon Code'), { target: { value: 'BAD' } });

        fireEvent.click(screen.getByText('Apply'));

        await screen.findByText(/Invalid coupon/i);

    });

    it('opens PaymentForm when clicking Proceed to Checkout', () => {

        render(<CartOverlay isOpen={true} onClose={onClose} cart={cart} setCart={setCart} />);

        fireEvent.click(screen.getByText('Proceed to Checkout'));

        expect(screen.getByTestId('payment-form-mock')).toBeInTheDocument();

    });

});