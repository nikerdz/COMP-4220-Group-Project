import { useState } from "react";
import { API_BASE } from "../../api";

interface AddModalProps {
    onClose: () => void;
    reload: () => void;
}

export default function CategoryAddModal({ onClose, reload }: AddModalProps) {
    const [form, setForm] = useState({
        CategoryID: "",
        Name: "",
        Description: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        if (!form.CategoryID || !form.Name)
            return alert("CategoryID and Name are required.");

        const payload = {
            CategoryID: Number(form.CategoryID),
            Name: form.Name,
            Description: form.Description
        };

        const res = await fetch(`${API_BASE}/api/admin/categories`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            alert("Failed to add category");
            return;
        }

        reload();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
            <div className="bg-white p-6 w-96 rounded shadow">
                <h2 className="text-xl font-bold mb-4">Add Category</h2>

                <input
                    className="input mb-2 w-full"
                    name="CategoryID"
                    placeholder="Category ID"
                    value={form.CategoryID}
                    onChange={handleChange}
                />

                <input
                    className="input mb-2 w-full"
                    name="Name"
                    placeholder="Category Name"
                    value={form.Name}
                    onChange={handleChange}
                />

                <input
                    className="input mb-4 w-full"
                    name="Description"
                    placeholder="Description"
                    value={form.Description}
                    onChange={handleChange}
                />

                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
                </div>
            </div>
        </div>
    );
}
