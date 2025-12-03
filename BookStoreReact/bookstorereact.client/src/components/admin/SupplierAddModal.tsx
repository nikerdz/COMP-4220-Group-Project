import { useState } from "react";
import { API_BASE } from "../../api";

interface Props {
    onClose: () => void;
    reload: () => void;
}

export default function SupplierAddModal({ onClose, reload }: Props) {

    const [form, setForm] = useState({
        SupplierID: "",
        Name: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        if (!form.SupplierID || !form.Name) {
            alert("SupplierID and Name are required.");
            return;
        }

        const payload = {
            SupplierID: Number(form.SupplierID),
            Name: form.Name
        };

        const res = await fetch(`${API_BASE}/api/admin/suppliers`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            alert("Failed to add supplier.");
            return;
        }

        reload();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
            <div className="bg-white p-6 w-96 rounded shadow">
                <h2 className="text-xl font-bold mb-4">Add Supplier</h2>

                <input
                    name="SupplierID"
                    className="input mb-2 w-full"
                    placeholder="Supplier ID"
                    value={form.SupplierID}
                    onChange={handleChange}
                />

                <input
                    name="Name"
                    className="input mb-4 w-full"
                    placeholder="Supplier Name"
                    value={form.Name}
                    onChange={handleChange}
                />

                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
