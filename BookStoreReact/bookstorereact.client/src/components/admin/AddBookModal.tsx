import { useState, useEffect } from "react";
import { API_BASE } from "../../api";

interface Category {
    CategoryID: number;
    Name: string;
}

interface Supplier {
    SupplierID: number;
    Name: string;
}

interface Props {
    onClose: () => void;
    reload: () => void;
}

export default function AddBookModal({ onClose, reload }: Props) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);

    const [form, setForm] = useState({
        isbn: "",
        categoryID: "",
        supplierId: "",
        title: "",
        author: "",
        price: "",
        year: "",
        edition: "",
        publisher: "",
        inStock: "",
    });

    useEffect(() => {
        async function loadLists() {
            const cat = await (await fetch(`${API_BASE}/api/admin/categories`)).json();
            const sup = await (await fetch(`${API_BASE}/api/admin/suppliers`)).json();

            // 🔥 Normalize casing so frontend works
            setCategories(cat);
            setSuppliers(
                sup.map((s: any) => ({
                    SupplierID: s.SupplierID,
                    Name: s.Name,
                }))
            );
        }
        loadLists();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = async () => {
        const payload = {
            isbn: form.isbn,
            categoryID: Number(form.categoryID),
            supplierId: form.supplierId ? Number(form.supplierId) : null,
            title: form.title,
            author: form.author,
            price: Number(form.price),
            year: form.year,
            edition: form.edition,
            publisher: form.publisher,
            inStock: Number(form.inStock),
        };

        const res = await fetch(`${API_BASE}/api/admin/books`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const err = await res.json();
            alert("Failed to add book: " + err.error);
            return;
        }

        reload();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow w-96">
                <h2 className="text-xl font-bold mb-4">Add Book</h2>

                <input name="isbn" placeholder="ISBN (10 chars)" className="input mb-2 w-full"
                    onChange={handleChange} value={form.isbn} />

                <select name="categoryID" className="input mb-2 w-full" onChange={handleChange} value={form.categoryID}>
                    <option value="">Select Category</option>
                    {categories.map(c => (
                        <option key={c.CategoryID} value={c.CategoryID}>{c.Name}</option>
                    ))}
                </select>

                <select name="supplierId" className="input mb-2 w-full" onChange={handleChange} value={form.supplierId}>
                    <option value="">Select Supplier</option>
                    {suppliers.map(s => (
                        <option key={s.SupplierID} value={s.SupplierID}>{s.Name}</option>
                    ))}
                </select>

                <input name="title" className="input mb-2 w-full" placeholder="Title"
                    onChange={handleChange} value={form.title} />

                <input name="author" className="input mb-2 w-full" placeholder="Author"
                    onChange={handleChange} value={form.author} />

                <input name="price" type="number" className="input mb-2 w-full" placeholder="Price"
                    onChange={handleChange} value={form.price} />

                <input name="year" className="input mb-2 w-full" placeholder="Year (4 chars)"
                    onChange={handleChange} value={form.year} />

                <input name="edition" className="input mb-2 w-full" placeholder="Edition (2 chars)"
                    onChange={handleChange} value={form.edition} />

                <input name="publisher" className="input mb-2 w-full" placeholder="Publisher"
                    onChange={handleChange} value={form.publisher} />

                <input name="inStock" type="number" className="input mb-4 w-full"
                    placeholder="In Stock" onChange={handleChange} value={form.inStock} />

                <div className="flex justify-end gap-2">
                    <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>Cancel</button>
                    <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={handleSave}>Save</button>
                </div>
            </div>
        </div>
    );
}
