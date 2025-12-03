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
            headers: { "Content-Type": "application/json" }
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({ error: "Unknown error" }));
            alert(`Failed to delete: ${err.error}`);
            return;
        }

        reload();
    };

    return (
        <div className="max-h-[600px] overflow-y-auto border rounded shadow">
            <table className="table-auto w-full border-collapse">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-2 text-left w-[140px]">ISBN</th>
                        <th className="px-4 py-2 text-left w-[250px]">Title</th>
                        <th className="px-4 py-2 text-left w-[200px]">Author</th>
                        <th className="px-4 py-2 text-left w-[120px]">Price</th>
                        <th className="px-4 py-2 text-left w-[100px]">Stock</th>
                        <th className="px-4 py-2 text-left w-[180px]">Supplier</th>
                        <th className="px-4 py-2 text-left w-[180px]">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {books.map(b => (
                        <tr key={b.ISBN} className="border-t">
                            <td className="px-4 py-2">{b.ISBN}</td>
                            <td className="px-4 py-2">{b.Title}</td>
                            <td className="px-4 py-2">{b.Author}</td>
                            <td className="px-4 py-2">${b.Price}</td>
                            <td className="px-4 py-2">{b.InStock}</td>
                            <td className="px-4 py-2">{b.SupplierName ?? "N/A"}</td>

                            <td className="px-4 py-2">
                                <div className="flex gap-2">
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
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
