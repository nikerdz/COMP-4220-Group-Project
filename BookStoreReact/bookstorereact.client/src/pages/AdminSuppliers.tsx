import { useEffect, useState } from "react";
import { API_BASE } from "../api";

import SuppliersTable from "../components/admin/SuppliersTable";
import SupplierAddModal from "../components/admin/SupplierAddModal";
import SupplierEditModal from "../components/admin/SupplierEditModal";

export interface Supplier {
    SupplierID: number;
    Name: string;
}

export default function AdminSuppliers() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(true);

    const [showAdd, setShowAdd] = useState(false);
    const [editSupplier, setEditSupplier] = useState<Supplier | null>(null);

    const loadData = () => {
        return fetch(`${API_BASE}/api/admin/suppliers`)
            .then(res => res.json())
            .then(data => setSuppliers(data))
            .catch(() => setSuppliers([]));
    };

    useEffect(() => {
        loadData().finally(() => setLoading(false));
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Suppliers</h1>
                <button
                    onClick={() => setShowAdd(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                >
                    + Add Supplier
                </button>
            </div>

            {loading ? (
                <p>Loading suppliers...</p>
            ) : (
                <SuppliersTable
                    suppliers={suppliers}
                    reload={loadData}
                    setEditSupplier={setEditSupplier}
                />
            )}

            {showAdd && (
                <SupplierAddModal
                    onClose={() => setShowAdd(false)}
                    reload={loadData}
                />
            )}

            {editSupplier && (
                <SupplierEditModal
                    supplier={editSupplier}
                    onClose={() => setEditSupplier(null)}
                    reload={loadData}
                />
            )}
        </div>
    );
}
