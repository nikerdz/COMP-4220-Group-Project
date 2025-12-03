import type { Book } from "../../pages/AdminInventory";
import { API_BASE } from "../../api";

interface Props {
    books: Book[];
    reload: () => void;
    setEditBook: (b: Book) => void;
}

export default function InventoryTable({ books, reload, setEditBook }: Props) {

    const handleDelete = async (isbn: string) => {
        if (!confirm("Delete this book?")) return;

        const res = await fetch(`${API_BASE}/api/admin/books/${isbn}`, {
            method: "DELETE",
        });

        if (!res.ok) {
            alert("Failed to delete book.");
            return;
        }

        reload();
    };

    return (
        <table className="table-auto w-full border-collapse">
            <thead className="bg-gray-100">
                <tr>
                    <th className="px-4 py-2 text-left w-[140px]">ISBN</th>
                    <th className="px-4 py-2 text-left w-[250px]">Title</th>
                    <th className="px-4 py-2 text-left w-[200px]">Author</th>
                    <th className="px-4 py-2 text-left w-[100px]">Price</th>
                    <th className="px-4 py-2 text-left w-[100px]">Stock</th>
                    <th className="px-4 py-2 text-left w-[180px]">Supplier</th>
                    <th className="px-4 py-2 text-left w-[180px]">Actions</th>
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
