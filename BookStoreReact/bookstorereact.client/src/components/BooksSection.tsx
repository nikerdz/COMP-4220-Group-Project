import { useEffect, useState } from "react";
import {
    mapBackendToBookItem,
    type BookItem,
    type BackendBook,
} from "./booksMapper";

const categoryColors: Record<string, string> = {
    Biography: "bg-[#B8BC92] text-white",   // that muted green cover
    "Self-Help": "bg-[#C94B3B] text-white",   // red Self Help cover
    Business: "bg-[#2B8B8E] text-white",   // teal Business cover
    Programming: "bg-[#C66C33] text-white",   // orange Programming cover
    Software: "bg-[#7C6A52] text-white",   // khaki/brown Software cover
    Classics: "bg-[#5B3B33] text-white",   // dark brown Classics cover
    Default: "bg-[#3B1F16] text-[#F5EBDD]" // fallback
};


export default function BooksSection() {
    const [books, setBooks] = useState<BookItem[]>([]);
    const [selectedBook, setSelectedBook] = useState<BookItem | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                setError(null);

                // direct backend URL (no proxy)
                const res = await fetch("http://localhost:5187/api/test/books");

                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}`);
                }

                const data = (await res.json()) as BackendBook[];
                const mapped = data.map(mapBackendToBookItem);

                setBooks(mapped);
            } catch (err) {
                // eslint-disable-next-line no-console
                console.error(err);
                setError("Failed to load books from server.");
            }
        };

        void fetchBooks();
    }, []);

    const getCategoryClass = (category: string): string =>
        categoryColors[category] || categoryColors.Default;

    return (
        <section className="bg-white py-16 px-6">
            <h2 className="text-3xl font-semibold text-gray-800 text-center mb-8">
                Books
            </h2>

            {error && (
                <p className="text-center text-red-600 mb-4 text-sm">{error}</p>
            )}

            <div className="max-w-6xl mx-auto grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {books.map((book) => (
                    <article
                        key={book.id}
                        className="bg-white/90 rounded-2xl shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => setSelectedBook(book)}
                    >
                        <div className="aspect-[3/4] w-full bg-[#f5f5f5] flex items-center justify-center">
                            <img
                                src={book.imageUrl}
                                alt={book.title}
                                className="max-h-full max-w-full object-contain"
                            />
                        </div>

                        <div className="p-4 flex flex-col flex-1">
                            <div
                                className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold mb-2 ${getCategoryClass(
                                    book.category
                                )}`}
                            >
                                {book.category}
                            </div>

                            <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                                {book.title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
                            <p className="text-sm text-gray-500 line-clamp-3">
                                {book.shortDescription}
                            </p>
                        </div>
                    </article>
                ))}
            </div>

            {selectedBook && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-2xl font-semibold text-gray-900">
                                {selectedBook.title}
                            </h3>
                            <button
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => setSelectedBook(null)}
                            >
                                ✕
                            </button>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                            by {selectedBook.author} · {selectedBook.category}
                        </p>
                        <p className="text-gray-800 mb-4">
                            {selectedBook.description}
                        </p>
                        <img
                            src={selectedBook.imageUrl}
                            alt={selectedBook.title}
                            className="w-full rounded-lg"
                        />
                    </div>
                </div>
            )}
        </section>
    );
}
