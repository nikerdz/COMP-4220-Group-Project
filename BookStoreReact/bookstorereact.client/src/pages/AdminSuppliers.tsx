import { useEffect, useState } from "react";
import SuppliersTable from "../components/admin/SuppliersTable";
import SupplierAddModal from "../components/admin/SupplierAddModal";
import SupplierEditModal from "../components/admin/SupplierEditModal";
import { API_BASE } from "../api";

export interface Supplier {
    supplierId: number;
    name: string;
}

export default function AdminSuppliers() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [showAdd, setShowAdd] = useState<boolean>(false);
    const [editSupplier, setEditSupplier] = useState<Supplier | null>(null);

    const reload = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/admin/suppliers`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (!res.ok) throw new Error("Failed to fetch suppliers");

            const data = await res.json();
            setSuppliers(data);
        } catch (err) {
            console.error("Supplier API error:", err);
            setSuppliers([]);
        }
    };

    useEffect(() => {
        reload().finally(() => setLoading(false));
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Suppliers</h1>
                <button
                    onClick={() => setShowAdd(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    + Add Supplier
                </button>
            </div>

            {loading ? (
                <p>Loading suppliers...</p>
            ) : (
                <SuppliersTable
                    suppliers={suppliers}
                    reload={reload}
                    setEditSupplier={setEditSupplier}
                />
            )}

            {showAdd && (
                <SupplierAddModal
                    onClose={() => setShowAdd(false)}
                    reload={reload}
                />
            )}

            {editSupplier && (
                <SupplierEditModal
                    supplier={editSupplier}
                    onClose={() => setEditSupplier(null)}
                    reload={reload}
                />
            )}
        </div>
    );
}
