import { useEffect, useState } from "react";
import InventoryTable from "../components/admin/InventoryTable";
import AddBookModal from "../components/admin/AddBookModal";
import EditBookModal from "../components/admin/EditBookModal";
import { API_BASE } from "../api";

export interface Book {
    ISBN: string;
    CategoryID: number;
    SupplierID: number | null;   // 🔥 FIXED casing to match backend
    Title: string;
    Author: string;
    Price: number;
    Year: string;
    Edition: string;
    Publisher: string;
    InStock: number;
    SupplierName?: string | null;
}

export default function AdminInventory() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);

    const [showAdd, setShowAdd] = useState(false);
    const [editBook, setEditBook] = useState<Book | null>(null);

    const reload = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/admin/books`);
            const data = await res.json();
            setBooks(data);
        } catch (err) {
            console.error("Failed to load books:", err);
        }
    };

    useEffect(() => {
        reload().finally(() => setLoading(false));
    }, []);

    return (
        <div className="p-2">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Inventory</h1>

                <button
                    onClick={() => setShowAdd(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    + Add Book
                </button>
            </div>

            <div className="max-h-[600px] overflow-y-auto border rounded shadow bg-white">
                {loading ? (
                    <p className="p-4">Loading books...</p>
                ) : (
                    <InventoryTable
                        books={books}
                        reload={reload}
                        setEditBook={setEditBook}
                    />
                )}
            </div>

            {/* Modals */}
            {showAdd && (
                <AddBookModal
                    onClose={() => setShowAdd(false)}
                    reload={reload}
                />
            )}

            {editBook && (
                <EditBookModal
                    book={editBook}
                    onClose={() => setEditBook(null)}
                    reload={reload}
                />
            )}
        </div>
    );
}
