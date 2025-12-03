import { API_BASE } from "../../api";
import type { Supplier } from "../../pages/AdminSuppliers";

interface Props {
    suppliers: Supplier[];
    reload: () => void;
    setEditSupplier: (s: Supplier | null) => void;
}

export default function SuppliersTable({ suppliers, reload, setEditSupplier }: Props) {

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this supplier?")) return;

        const res = await fetch(`${API_BASE}/api/admin/suppliers/${id}`, {
            method: "DELETE"
        });

        if (!res.ok) {
            alert("Failed to delete supplier.");
            return;
        }

        reload();
    };

    return (
        <div className="overflow-x-auto rounded-lg shadow border bg-white">
            <table className="w-full table-auto border-collapse">
                <thead className="bg-gray-100 text-gray-700 font-semibold">
                    <tr>
                        <th className="p-3 text-left w-32">Supplier ID</th>
                        <th className="p-3 text-left w-64">Name</th>
                        <th className="p-3 text-left w-40">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {suppliers.map((s) => (
                        <tr
                            key={s.SupplierID}
                            className="border-t hover:bg-gray-50 transition"
                        >
                            <td className="p-3">{s.SupplierID}</td>

                            <td className="p-3">{s.Name}</td>

                            <td className="p-3">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setEditSupplier(s)}
                                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => handleDelete(s.SupplierID)}
                                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
