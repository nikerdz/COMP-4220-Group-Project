import { useEffect, useState } from "react";
import { API_BASE } from "../api";
import CategoryTable from "../components/admin/CategoryTable";
import AddCategoryModal from "../components/admin/CategoryAddModal";
import EditCategoryModal from "../components/admin/CategoryEditModal";

interface Category {
    CategoryID: number;
    Name: string | null;
    Description: string | null;
}

export default function AdminCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    const [showAdd, setShowAdd] = useState(false);
    const [editCategory, setEditCategory] = useState<Category | null>(null);

    const loadData = () => {
        return fetch(`${API_BASE}/api/admin/categories`)
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(() => setCategories([]));
    };

    useEffect(() => {
        loadData().finally(() => setLoading(false));
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Categories</h1>
                <button
                    onClick={() => setShowAdd(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                >
                    + Add Category
                </button>
            </div>

            {loading ? (
                <p>Loading categories...</p>
            ) : (
                <CategoryTable
                    categories={categories}
                    reload={loadData}
                    setEditCategory={setEditCategory}
                />
            )}

            {showAdd && (
                <AddCategoryModal onClose={() => setShowAdd(false)} reload={loadData} />
            )}

            {editCategory && (
                <EditCategoryModal
                    category={editCategory}
                    onClose={() => setEditCategory(null)}
                    reload={loadData}
                />
            )}
        </div>
    );
}
