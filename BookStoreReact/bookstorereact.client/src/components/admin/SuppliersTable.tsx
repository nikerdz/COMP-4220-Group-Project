import { API_BASE } from "../../api";

interface Supplier {
    supplierId: number;
    name: string;
}

interface SuppliersTableProps {
    suppliers: Supplier[];
    reload: () => void;
    setEditSupplier: (supplier: Supplier) => void;
}

export default function SuppliersTable({
    suppliers,
    reload,
    setEditSupplier
}: SuppliersTableProps) {

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this supplier?")) return;

        await fetch(`${API_BASE}/api/admin/suppliers/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
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
                {suppliers.map((s) => (
                    <tr key={s.supplierId} className="border-t">
                        <td className="p-2">{s.supplierId}</td>
                        <td className="p-2">{s.name}</td>

                        <td className="p-2 flex gap-2">
                            <button
                                onClick={() => setEditSupplier(s)}
                                className="px-3 py-1 bg-blue-600 text-white rounded"
                            >
                                Edit
                            </button>

                            <button
                                onClick={() => handleDelete(s.supplierId)}
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
