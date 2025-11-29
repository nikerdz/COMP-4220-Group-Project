import { useState, useEffect } from "react";
import { API_BASE } from "../../api";
import type { Book } from "../../pages/AdminInventory";

interface Category {
    categoryId: number;
    name: string;
}

interface Supplier {
    supplierId: number;
    name: string;
}

interface AddBookModalProps {
    onClose: () => void;
    reload: () => void;
}

export default function AddBookModal({ onClose, reload }: AddBookModalProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);

    const [form, setForm] = useState({
        isbn: "",
        categoryId: "",
        supplierId: "",
        title: "",
        author: "",
        price: "",
        year: "",
        edition: "",
        publisher: "",
        inStock: "",
    });

    // Load dropdown lists
    useEffect(() => {
        async function loadLists() {
            try {
                const catRes = await fetch(`${API_BASE}/api/admin/categories`);
                const supRes = await fetch(`${API_BASE}/api/admin/suppliers`);

                setCategories(await catRes.json());
                setSuppliers(await supRes.json());
            } catch (err) {
                console.error("Failed to load dropdown lists:", err);
            }
        }
        loadLists();
    }, []);

    // Handle input changes
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        if (!form.isbn || !form.categoryId || !form.edition || !form.inStock) {
            alert("Please fill all required fields (ISBN, Category, Edition, Stock).");
            return;
        }

        // Convert to the FULL Book object type expected by backend
        const payload: Partial<Book> = {
            isbn: form.isbn,
            categoryId: Number(form.categoryId),
            supplierId: form.supplierId === "" ? null : Number(form.supplierId),
            title: form.title,
            author: form.author,
            price: Number(form.price),
            year: form.year || null,
            edition: form.edition,
            publisher: form.publisher || null,
            inStock: Number(form.inStock),
        };

        const res = await fetch(`${API_BASE}/api/admin/books`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            alert("Failed to add book.");
            return;
        }

        reload();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
            <div className="bg-white p-6 w-96 rounded shadow">
                <h2 className="text-xl font-bold mb-4">Add Book</h2>

                <input
                    name="isbn"
                    placeholder="ISBN"
                    className="input mb-2 w-full"
                    onChange={handleChange}
                />

                <select
                    name="categoryId"
                    className="input mb-2 w-full"
                    value={form.categoryId}
                    onChange={handleChange}
                >
                    <option value="">Select Category</option>
                    {categories.map(c => (
                        <option key={c.categoryId} value={c.categoryId}>
                            {c.name}
                        </option>
                    ))}
                </select>

                <select
                    name="supplierId"
                    className="input mb-2 w-full"
                    value={form.supplierId}
                    onChange={handleChange}
                >
                    <option value="">Select Supplier</option>
                    {suppliers.map(s => (
                        <option key={s.supplierId} value={s.supplierId}>
                            {s.name}
                        </option>
                    ))}
                </select>

                <input name="title" className="input mb-2 w-full" placeholder="Title" onChange={handleChange} />
                <input name="author" className="input mb-2 w-full" placeholder="Author" onChange={handleChange} />

                <input
                    name="price"
                    type="number"
                    className="input mb-2 w-full"
                    placeholder="Price"
                    onChange={handleChange}
                />

                <input name="year" className="input mb-2 w-full" placeholder="Year" onChange={handleChange} />
                <input name="edition" className="input mb-2 w-full" placeholder="Edition" onChange={handleChange} />
                <input name="publisher" className="input mb-2 w-full" placeholder="Publisher" onChange={handleChange} />

                <input
                    name="inStock"
                    type="number"
                    className="input mb-4 w-full"
                    placeholder="In Stock"
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
