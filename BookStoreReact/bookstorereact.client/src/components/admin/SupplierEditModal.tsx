import { useState } from "react";
import { API_BASE } from "../../api";
import type { Supplier } from "../../pages/AdminSuppliers";

interface Props {
    supplier: Supplier;
    onClose: () => void;
    reload: () => void;
}

export default function SupplierEditModal({ supplier, onClose, reload }: Props) {

    const [form, setForm] = useState({
        SupplierID: supplier.SupplierID,
        Name: supplier.Name
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {

        const res = await fetch(`${API_BASE}/api/admin/suppliers/${form.SupplierID}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        });

        if (!res.ok) {
            alert("Failed to update supplier.");
            return;
        }

        reload();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
            <div className="bg-white p-6 w-96 rounded shadow">
                <h2 className="text-xl font-bold mb-4">Edit Supplier</h2>

                <input
                    name="SupplierID"
                    className="input mb-2 w-full bg-gray-200"
                    value={form.SupplierID}
                    disabled
                />

                <input
                    name="Name"
                    className="input mb-4 w-full"
                    value={form.Name}
                    onChange={handleChange}
                />

                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
