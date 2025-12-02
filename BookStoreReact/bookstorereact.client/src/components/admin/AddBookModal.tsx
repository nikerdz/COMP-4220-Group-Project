import { useState, useEffect } from "react";
import { API_BASE } from "../../api";

interface Category {
    CategoryID: number;
    Name: string;
}

interface Supplier {
    SupplierId: number;
    Name: string;
}

interface AddBookModalProps {
    onClose: () => void;
    reload: () => void;
}

export default function AddBookModal({ onClose, reload }: AddBookModalProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);

    const [form, setForm] = useState({
        ISBN: "",
        CategoryID: "",
        SupplierId: "",
        Title: "",
        Author: "",
        Price: "",
        Year: "",
        Edition: "",
        Publisher: "",
        InStock: "",
    });

    useEffect(() => {
        async function loadLists() {
            const c = await fetch(`${API_BASE}/api/admin/categories`);
            const s = await fetch(`${API_BASE}/api/admin/suppliers`);
            setCategories(await c.json());
            setSuppliers(await s.json());
        }
        loadLists();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = async () => {
        const payload = {
            ISBN: form.ISBN,
            CategoryID: Number(form.CategoryID),
            SupplierId: form.SupplierId ? Number(form.SupplierId) : null,
            Title: form.Title,
            Author: form.Author,
            Price: Number(form.Price),
            Year: form.Year,
            Edition: form.Edition,
            Publisher: form.Publisher,
            InStock: Number(form.InStock),
        };

        console.log("Sending payload:", payload);

        const res = await fetch(`${API_BASE}/api/admin/books`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
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
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
            <div className="bg-white p-6 w-96 rounded shadow">
                <h2 className="text-xl font-bold mb-4">Add Book</h2>

                <input name="ISBN" className="input mb-2 w-full" placeholder="ISBN (10 chars)"
                    value={form.ISBN} onChange={handleChange} />

                <select name="CategoryID" className="input mb-2 w-full"
                    value={form.CategoryID} onChange={handleChange}>
                    <option value="">Select Category</option>
                    {categories.map(c => (
                        <option key={c.CategoryID} value={c.CategoryID}>
                            {c.Name}
                        </option>
                    ))}
                </select>

                <select name="SupplierId" className="input mb-2 w-full"
                    value={form.SupplierId} onChange={handleChange}>
                    <option value="">Select Supplier</option>
                    {suppliers.map(s => (
                        <option key={s.SupplierId} value={s.SupplierId}>
                            {s.Name}
                        </option>
                    ))}
                </select>

                <input name="Title" className="input mb-2 w-full" placeholder="Title"
                    value={form.Title} onChange={handleChange} />

                <input name="Author" className="input mb-2 w-full" placeholder="Author"
                    value={form.Author} onChange={handleChange} />

                <input name="Price" type="number" className="input mb-2 w-full" placeholder="Price"
                    value={form.Price} onChange={handleChange} />

                <input name="Year" className="input mb-2 w-full" placeholder="Year (4 chars)"
                    value={form.Year} onChange={handleChange} />

                <input name="Edition" className="input mb-2 w-full" placeholder="Edition (2 chars)"
                    value={form.Edition} onChange={handleChange} />

                <input name="Publisher" className="input mb-2 w-full" placeholder="Publisher"
                    value={form.Publisher} onChange={handleChange} />

                <input name="InStock" type="number" className="input mb-4 w-full"
                    placeholder="In Stock" value={form.InStock} onChange={handleChange} />

                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
                </div>
            </div>
        </div>
    );
}
