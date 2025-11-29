import { useState } from "react";
import { API_BASE } from "../../api";

interface SupplierAddModalProps {
    onClose: () => void;
    reload: () => void;
}

export default function SupplierAddModal({ onClose, reload }: SupplierAddModalProps) {
    const [name, setName] = useState("");

    const handleSave = async () => {
        if (!name.trim()) {
            alert("Supplier name is required.");
            return;
        }

        const res = await fetch(`${API_BASE}/api/admin/suppliers`, {
            method: "POST",
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
            alert("Failed to add supplier.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
            <div className="bg-white p-6 w-80 rounded shadow">
                <h2 className="text-xl font-bold mb-4">Add Supplier</h2>

                <input
                    className="input mb-4 w-full"
                    placeholder="Supplier Name"
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
                        className="px-4 py-2 bg-green-600 text-white rounded"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
