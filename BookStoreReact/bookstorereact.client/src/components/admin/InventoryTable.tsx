import { API_BASE } from "../../api";
import type { Book } from "../../pages/AdminInventory";

interface InventoryTableProps {
    books: Book[];
    reload: () => void;
    setEditBook: (b: Book) => void;
}

export default function InventoryTable({ books, reload, setEditBook }: InventoryTableProps) {
    const handleDelete = async (isbn: string) => {
        if (!confirm("Delete this book?")) return;

        await fetch(`${API_BASE}/api/admin/books/${isbn}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });

        reload();
    };

    return (
        <table className="w-full bg-white shadow border border-gray-200 rounded">
            <thead className="bg-gray-100">
                <tr>
                    <th className="p-2 text-left">ISBN</th>
                    <th className="p-2 text-left">Title</th>
                    <th className="p-2 text-left">Author</th>
                    <th className="p-2 text-left">Price</th>
                    <th className="p-2 text-left">Stock</th>
                    <th className="p-2 text-left">Supplier</th>
                    <th className="p-2 text-left">Actions</th>
                </tr>
            </thead>

            <tbody>
                {books.map((b) => (
                    <tr key={b.isbn} className="border-t">
                        <td className="p-2">{b.isbn}</td>
                        <td className="p-2">{b.title}</td>
                        <td className="p-2">{b.author}</td>
                        <td className="p-2">${b.price}</td>
                        <td className="p-2">{b.inStock}</td>
                        <td className="p-2">{b.supplierName ?? "N/A"}</td>

                        <td className="p-2 flex gap-2">
                            <button
                                onClick={() => setEditBook(b)}
                                className="px-3 py-1 bg-blue-600 text-white rounded"
                            >
                                Edit
                            </button>

                            <button
                                onClick={() => handleDelete(b.isbn)}
                                className="px-3 py-1 bg-red-600 text-white rounded"
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
