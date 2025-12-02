import { useEffect, useState } from "react";
import InventoryTable from "../components/admin/InventoryTable";
import AddBookModal from "../components/admin/AddBookModal";
import EditBookModal from "../components/admin/EditBookModal";
import { API_BASE } from "../api";

// FULL BOOK MODEL USED ACROSS ENTIRE ADMIN SYSTEM
export interface Book {
    isbn: string;
    categoryId: number;
    supplierId?: number | null;
    title: string;
    author: string;
    price: number;
    year?: string | null;
    edition: string;
    publisher?: string | null;
    inStock: number;
    supplierName?: string | null;
}

export default function AdminInventory() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);

    const [showAdd, setShowAdd] = useState(false);
    const [editBook, setEditBook] = useState<Book | null>(null);

    const reload = () => {
        return fetch(`${API_BASE}/api/admin/books`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(res => {
                if (!res.ok) throw new Error("Failed to load books");
                return res.json();
            })
            .then(data => setBooks(data))
            .catch(err => {
                console.error("API Error (books):", err);
                setBooks([]);
            });
    };

    useEffect(() => {
        reload().finally(() => setLoading(false));
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Inventory</h1>

                <button
                    onClick={() => setShowAdd(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    + Add Book
                </button>
            </div>

            {loading ? (
                <p>Loading books...</p>
            ) : (
                <InventoryTable
                    books={books}
                    reload={reload}
                    setEditBook={setEditBook}
                />
            )}

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
