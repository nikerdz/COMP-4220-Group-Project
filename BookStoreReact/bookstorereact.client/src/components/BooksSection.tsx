import { useEffect, useState } from "react";
import {
    mapBackendToBookItem,
    filterBooks,
    type BookItem,
    type BackendBook,
} from "./booksMapper";

const categoryColors: Record<string, string> = {
    Biography: "bg-[#B8BC92] text-white",
    "Self-Help": "bg-[#C94B3B] text-white",
    Business: "bg-[#2B8B8E] text-white",
    Programming: "bg-[#C66C33] text-white",
    Software: "bg-[#7C6A52] text-white",
    Classics: "bg-[#5B3B33] text-white",
    Default: "bg-[#3B1F16] text-[#F5EBDD]",
};

export default function BooksSection() {
    const [books, setBooks] = useState<BookItem[]>([]);
    const [selectedBook, setSelectedBook] = useState<BookItem | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");

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

    // NEW: apply search filter on every render
    const filteredBooks = filterBooks(books, search);

    return (
        <section className="bg-white py-16 px-6">
            <h2 className="text-3xl font-semibold text-gray-800 text-center mb-4">
                Books
            </h2>

            {error && (
                <p className="text-center text-red-600 mb-4 text-sm">{error}</p>
            )}

            {/* NEW: search input */}
            <div className="max-w-6xl mx-auto mb-6">
                <input
                    type="text"
                    placeholder="Search by title, author, or category..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            {/* Grid wrapper + 'no results' state */}
            <div className="max-w-6xl mx-auto">
                {filteredBooks.length === 0 ? (
                    <p className="text-center text-gray-500 text-sm">
                        No books found.
                    </p>
                ) : (
                    <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {filteredBooks.map((book) => (
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
                                    <p className="text-sm text-gray-600 mb-2">
                                        by {book.author}
                                    </p>
                                    <p className="text-sm text-gray-500 line-clamp-3">
                                        {book.shortDescription}
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
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
