import { API_BASE } from "../../api";

interface Category {
    CategoryID: number;
    Name: string | null;
    Description: string | null;
}

interface CategoryTableProps {
    categories: Category[];
    reload: () => void;
    setEditCategory: (c: Category | null) => void;
}

export default function CategoryTable({ categories, reload, setEditCategory }: CategoryTableProps) {

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this category?")) return;

        const res = await fetch(`${API_BASE}/api/admin/categories/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        });

        if (!res.ok) {
            const msg = await res.text();
            alert("Failed to delete category: " + msg);
            return;
        }

        reload();
    };

    return (
        <div className="max-h-[600px] overflow-y-auto border rounded shadow">
            <table className="table-auto w-full border-collapse">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-2 text-left w-[120px]">ID</th>
                        <th className="px-4 py-2 text-left w-[200px]">Name</th>
                        <th className="px-4 py-2 text-left w-[400px]">Description</th>
                        <th className="px-4 py-2 text-left w-[200px]">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {categories.map((c) => (
                        <tr key={c.CategoryID} className="border-t">
                            <td className="px-4 py-2">{c.CategoryID}</td>
                            <td className="px-4 py-2">{c.Name}</td>
                            <td className="px-4 py-2">{c.Description ?? "—"}</td>

                            <td className="px-4 py-2">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setEditCategory(c)}
                                        className="px-3 py-1 bg-blue-600 text-white rounded"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => handleDelete(c.CategoryID)}
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
