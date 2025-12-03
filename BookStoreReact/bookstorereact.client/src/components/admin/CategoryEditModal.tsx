import { useState } from "react";
import { API_BASE } from "../../api";

interface Category {
    CategoryID: number;
    Name: string | null;
    Description: string | null;
}

interface EditModalProps {
    category: Category;
    onClose: () => void;
    reload: () => void;
}

export default function CategoryEditModal({ category, onClose, reload }: EditModalProps) {

    const [form, setForm] = useState({
        CategoryID: category.CategoryID,
        Name: category.Name ?? "",
        Description: category.Description ?? ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        const res = await fetch(`${API_BASE}/api/admin/categories/${form.CategoryID}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        });

        if (!res.ok) {
            alert("Failed to update category");
            return;
        }

        reload();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
            <div className="bg-white p-6 w-96 rounded shadow">
                <h2 className="text-xl font-bold mb-4">Edit Category</h2>

                <input
                    name="CategoryID"
                    value={form.CategoryID}
                    disabled
                    className="input mb-2 w-full bg-gray-200"
                />

                <input
                    name="Name"
                    value={form.Name}
                    onChange={handleChange}
                    className="input mb-2 w-full"
                />

                <input
                    name="Description"
                    value={form.Description}
                    onChange={handleChange}
                    className="input mb-4 w-full"
                />

                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
                </div>
            </div>
        </div>
    );
}
