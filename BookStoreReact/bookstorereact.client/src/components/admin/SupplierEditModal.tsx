import { useState } from "react";
import { API_BASE } from "../../api";

interface Supplier {
    SupplierId: number;
    Name: string;
}

interface EditSupplierModalProps {
    supplier: Supplier;
    onClose: () => void;
    reload: () => void;
}

export default function EditSupplierModal({ supplier, onClose, reload }: EditSupplierModalProps) {
    const [form, setForm] = useState({
        SupplierId: supplier.SupplierId,
        Name: supplier.Name
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        if (!form.Name.trim()) {
            alert("Supplier Name cannot be empty.");
            return;
        }

        const payload = {
            SupplierId: form.SupplierId,
            Name: form.Name.trim()
        };

        const res = await fetch(`${API_BASE}/api/admin/suppliers/${form.SupplierId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const msg = await res.text();
            alert("Failed to update supplier: " + msg);
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
                    className="input mb-2 w-full bg-gray-200"
                    name="SupplierId"
                    value={form.SupplierId}
                    disabled
                />

                <input
                    className="input mb-4 w-full"
                    name="Name"
                    value={form.Name}
                    onChange={handleChange}
                />

                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
                </div>
            </div>
        </div>
    );
}
