import React from "react";
import { API_BASE } from "../../api";

interface Supplier {
    SupplierId: number;
    Name: string;
}

interface Props {
    suppliers: Supplier[];
    reload: () => void;
    setEditSupplier: (s: Supplier | null) => void;
}

export default function SuppliersTable({ suppliers, reload, setEditSupplier }: Props) {

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this supplier?")) return;

        const res = await fetch(`${API_BASE}/api/admin/suppliers/${id}`, {
            method: "DELETE",
        });

        if (!res.ok) {
            const msg = await res.text();
            alert("Failed to delete supplier: " + msg);
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
                    <th className="p-2 text-left">Actions</th>
                </tr>
            </thead>

            <tbody>
                {suppliers.map((s) => (
                    <tr key={s.SupplierId} className="border-t">
                        <td className="p-2">{s.SupplierId}</td>
                        <td className="p-2">{s.Name}</td>

                        <td className="p-2 flex gap-2">
                            <button
                                onClick={() => setEditSupplier(s)}
                                className="px-3 py-1 bg-blue-600 text-white rounded"
                            >
                                Edit
                            </button>

                            <button
                                onClick={() => handleDelete(s.SupplierId)}
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
