import type { BookItem } from "./booksMapper";

type BookOverlayProps = {
    book: BookItem;
    onClose: () => void;
    onAddToCart: (book: BookItem) => void;
    onAddToWishlist: (book: BookItem) => void;
};

export default function BookOverlay({
    book,
    onClose,
    onAddToCart,
    onAddToWishlist,
}: BookOverlayProps) {
    const primaryLabel = book.inStock === 0 ? "Pre-Order" : "Add to Cart";

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-xl transition-colors">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                        {book.title}
                    </h3>
                    <button
                        className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    by {book.author} · {book.category}
                </p>
                <p className="text-gray-800 dark:text-gray-200 mb-4">
                    {book.description}
                </p>
                <img
                    src={book.imageUrl}
                    alt={book.title}
                    className="w-full rounded-lg"
                />
                <div className="flex items-center justify-between border-t pt-4">
                    <div>
                        <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            ${book.price.toFixed(2)}
                        </span>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => onAddToCart(book)}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                            {primaryLabel}
                        </button>

                        <button
                            onClick={() => onAddToWishlist(book)}
                            aria-label="Add to wishlist"
                            className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-xl"
                        >
                            ♥
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
