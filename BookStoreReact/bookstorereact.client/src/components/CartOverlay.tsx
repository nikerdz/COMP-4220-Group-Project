import { TablerX } from '../icons/Close';
import { TablerShoppingCart } from '../icons/Cart';

interface CartOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CartOverlay({ isOpen, onClose }: CartOverlayProps) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={onClose} // Close when clicking the backdrop
        >
            {/* Blurred backdrop - covers entire screen */}
            <div className="absolute inset-0 bg-black/30" />

            {/* Cart container - 60% width */}
            <div
                className="relative w-[60%] h-[85vh] bg-white rounded-2xl shadow-2xl flex flex-col"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside cart
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b shrink-0">
                    <h2 className="text-2xl font-semibold text-gray-900">Shopping Cart</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Close cart"
                    >
                        <TablerX className="h-6 w-6" />
                    </button>
                </div>

                {/* Empty cart content */}
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-gray-500">
                    <TablerShoppingCart className="h-24 w-24 mb-4 text-gray-300" />
                    <p className="text-lg mb-2">Your cart is empty</p>
                    <p className="text-sm text-gray-400 text-center">
                        Start shopping to add items to your cart
                    </p>
                </div>
            </div>
        </div>
    );
}