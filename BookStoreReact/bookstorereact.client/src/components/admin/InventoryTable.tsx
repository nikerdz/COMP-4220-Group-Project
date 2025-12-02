import type { Book } from "../../pages/AdminInventory";
import { API_BASE } from "../../api";

interface Props {
    books: Book[];
    reload: () => void;
    setEditBook: (b: Book) => void;
}

export default function InventoryTable({ books, reload, setEditBook }: Props) {
    const handleDelete = async (ISBN: string) => {
        if (!confirm("Delete this book?")) return;

        const res = await fetch(`${API_BASE}/api/admin/books/${ISBN}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({ error: "Unknown error" }));
            alert(`Failed to delete: ${err.error}`);
            return;
        }

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
                {books.map(b => (
                    <tr key={b.ISBN} className="border-t">
                        <td className="p-2">{b.ISBN}</td>
                        <td className="p-2">{b.Title}</td>
                        <td className="p-2">{b.Author}</td>
                        <td className="p-2">${b.Price}</td>
                        <td className="p-2">{b.InStock}</td>
                        <td className="p-2">{b.SupplierName ?? "N/A"}</td>

                        <td className="p-2 flex gap-2">
                            <button
                                onClick={() => setEditBook(b)}
                                className="px-3 py-1 bg-blue-600 text-white rounded"
                            >
                                Edit
                            </button>

                            <button
                                onClick={() => handleDelete(b.ISBN)}
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
