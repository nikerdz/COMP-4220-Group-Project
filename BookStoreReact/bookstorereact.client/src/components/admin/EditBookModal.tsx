import { useEffect, useState } from "react";
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

interface EditBookModalProps {
    book: Book;
    onClose: () => void;
    reload: () => void;
}

export default function EditBookModal({ book, onClose, reload }: EditBookModalProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);

    const [form, setForm] = useState<Book>({
        ...book,
        year: book.year ?? "",
        publisher: book.publisher ?? "",
        supplierId: book.supplierId ?? null
    });

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setForm(prev => ({
            ...prev,
            [name]:
                ["price", "inStock", "categoryId", "supplierId"].includes(name)
                    ? value === "" ? null : Number(value)
                    : value
        }));
    };

    const handleSave = async () => {
        const res = await fetch(`${API_BASE}/api/admin/books/${book.isbn}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(form)
        });

        if (!res.ok) return alert("Failed to update book.");

        reload();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
            <div className="bg-white p-6 w-96 rounded shadow">
                <h2 className="text-xl font-bold mb-4">Edit Book</h2>

                <input name="isbn" readOnly className="input mb-2 w-full" value={form.isbn} />

                <select
                    name="categoryId"
                    className="input mb-2 w-full"
                    value={form.categoryId}
                    onChange={handleChange}
                >
                    {categories.map((c) => (
                        <option key={c.categoryId} value={c.categoryId}>
                            {c.name}
                        </option>
                    ))}
                </select>

                <select
                    name="supplierId"
                    className="input mb-2 w-full"
                    value={form.supplierId ?? ""}
                    onChange={handleChange}
                >
                    <option value="">Select Supplier</option>
                    {suppliers.map((s) => (
                        <option key={s.supplierId} value={s.supplierId}>
                            {s.name}
                        </option>
                    ))}
                </select>

                <input name="title" className="input mb-2 w-full" value={form.title} onChange={handleChange} />
                <input name="author" className="input mb-2 w-full" value={form.author} onChange={handleChange} />
                <input name="price" type="number" className="input mb-2 w-full" value={form.price} onChange={handleChange} />
                <input name="year" className="input mb-2 w-full" value={form.year ?? ""} onChange={handleChange} />
                <input name="edition" className="input mb-2 w-full" value={form.edition} onChange={handleChange} />
                <input name="publisher" className="input mb-2 w-full" value={form.publisher ?? ""} onChange={handleChange} />
                <input name="inStock" type="number" className="input mb-4 w-full" value={form.inStock} onChange={handleChange} />

                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded">Update</button>
                </div>
            </div>
        </div>
    );
}
