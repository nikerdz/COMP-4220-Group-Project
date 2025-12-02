import { useEffect, useState } from "react";
import CategoryTable from "../components/admin/CategoryTable";
import CategoryAddModal from "../components/admin/CategoryAddModal";
import CategoryEditModal from "../components/admin/CategoryEditModal";
import { API_BASE } from "../api";

interface Category {
    categoryId: number;
    name: string;
}
export default function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showAdd, setShowAdd] = useState(false);
    const [editCategory, setEditCategory] = useState<Category | null>(null);

    const reload = () => {
        return fetch(`${API_BASE}/api/admin/categories`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to load categories");
                return res.json();
            })
            .then((data) => setCategories(data))
            .catch((err) => {
                console.error("Categories load error:", err);
                setCategories([]);
            });
    };

    useEffect(() => {
        reload().finally(() => setLoading(false));
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Categories</h1>
                <button
                    onClick={() => setShowAdd(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    + Add Category
                </button>
            </div>

            {loading ? (
                <p>Loading categories...</p>
            ) : (
                <CategoryTable
                    categories={categories}
                    reload={reload}
                    setEditCategory={setEditCategory}
                />
            )}

            {showAdd && (
                <CategoryAddModal
                    onClose={() => setShowAdd(false)}
                    reload={reload}
                />
            )}

            {editCategory && (
                <CategoryEditModal
                    category={editCategory}
                    onClose={() => setEditCategory(null)}
                    reload={reload}
                />
            )}
        </div>
    );
}
