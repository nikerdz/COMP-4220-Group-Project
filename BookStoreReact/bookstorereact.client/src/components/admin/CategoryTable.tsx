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
        <table className="w-full bg-white shadow border border-gray-200 rounded">
            <thead className="bg-gray-100">
                <tr>
                    <th className="p-2 text-left">ID</th>
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-left">Description</th>
                    <th className="p-2 text-left">Actions</th>
                </tr>
            </thead>

            <tbody>
                {categories.map((c) => (
                    <tr key={c.CategoryID} className="border-t">
                        <td className="p-2">{c.CategoryID}</td>
                        <td className="p-2">{c.Name}</td>
                        <td className="p-2">{c.Description ?? "—"}</td>

                        <td className="p-2 flex gap-2">
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
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
