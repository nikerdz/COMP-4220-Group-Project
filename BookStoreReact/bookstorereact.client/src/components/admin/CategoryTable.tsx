import { API_BASE } from "../../api";

interface Category {
    categoryId: number;
    name: string;
}

interface CategoryTableProps {
    categories: Category[];
    reload: () => void;
    setEditCategory: (c: Category | null) => void; // FIXED TYPE
}

export default function CategoryTable({
    categories,
    reload,
    setEditCategory
}: CategoryTableProps) {

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this category?")) return;

        await fetch(`${API_BASE}/api/admin/categories/${id}`, {   // FIXED URL
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}` // optional
            }
        });

        reload();
    };

    return (
        <table className="w-full bg-white shadow border border-gray-200 rounded">
            <thead className="bg-gray-100">
                <tr>
                    <th className="p-2 text-left">ID</th>
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-left">Actions</th>
                </tr>
            </thead>

            <tbody>
                {categories.map((c) => (
                    <tr key={c.categoryId} className="border-t">
                        <td className="p-2">{c.categoryId}</td>
                        <td className="p-2">{c.name}</td>

                        <td className="p-2 flex gap-2">
                            <button
                                onClick={() => setEditCategory(c)}
                                className="px-3 py-1 bg-blue-600 text-white rounded"
                            >
                                Edit
                            </button>

                            <button
                                onClick={() => handleDelete(c.categoryId)}
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
