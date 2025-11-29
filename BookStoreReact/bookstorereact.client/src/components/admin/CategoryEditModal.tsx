import { useState } from "react";
import { API_BASE } from "../../api";

interface Category {
    categoryId: number;
    name: string;
}

interface CategoryEditModalProps {
    category: Category;
    onClose: () => void;
    reload: () => void;
}

export default function CategoryEditModal({ category, onClose, reload }: CategoryEditModalProps) {
    const [name, setName] = useState<string>(category.name);

    const handleSave = async () => {
        if (!name.trim()) {
            alert("Category name is required.");
            return;
        }

        const res = await fetch(`${API_BASE}/api/admin/categories/${category.categoryId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ name })
        });

        if (res.ok) {
            reload();
            onClose();
        } else {
            alert("Failed to update category.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
            <div className="bg-white p-6 w-80 rounded shadow">
                <h2 className="text-xl font-bold mb-4">Edit Category</h2>

                <input
                    className="input mb-4 w-full"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 rounded"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                        Update
                    </button>
                </div>
            </div>
        </div>
    );
}
