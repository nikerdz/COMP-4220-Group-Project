import { useEffect, useState } from "react";
import { API_BASE } from "../../api";
import type { Book } from "../../pages/AdminInventory";

interface Category {
    CategoryID: number;
    Name: string;
}

interface Supplier {
    SupplierId: number;
    Name: string;
}

interface EditBookModalProps {
    book: Book;
    onClose: () => void;
    reload: () => void;
}

export default function EditBookModal({ book, onClose, reload }: EditBookModalProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);

    const [form, setForm] = useState({
        ISBN: book.ISBN,
        CategoryID: String(book.CategoryID),
        SupplierId: book.SupplierId ? String(book.SupplierId) : "",
        Title: book.Title ?? "",
        Author: book.Author ?? "",
        Price: String(book.Price),
        Year: book.Year ?? "",
        Edition: book.Edition ?? "",
        Publisher: book.Publisher ?? "",
        InStock: String(book.InStock),
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
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        // VALIDATION
        if (form.ISBN.length !== 10) return alert("ISBN must be exactly 10 characters.");
        if (!form.CategoryID) return alert("Category is required.");
        if (form.Year.length !== 4) return alert("Year must be exactly 4 characters.");
        if (form.Edition.length !== 2) return alert("Edition must be exactly 2 characters.");

        const payload = {
            ISBN: form.ISBN,
            CategoryID: parseInt(form.CategoryID),
            SupplierId: form.SupplierId ? parseInt(form.SupplierId) : null,
            Title: form.Title,
            Author: form.Author,
            Price: parseFloat(form.Price),
            Year: form.Year,
            Edition: form.Edition,
            Publisher: form.Publisher,
            InStock: parseInt(form.InStock)
        };

        console.log("Sending update payload:", payload);

        const res = await fetch(`${API_BASE}/api/admin/books/${book.ISBN}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({ error: "Unknown error" }));
            alert(`Failed to update: ${err.error}`);
            return;
        }

        reload();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
            <div className="bg-white p-6 w-96 rounded shadow">
                <h2 className="text-xl font-bold mb-4">Edit Book</h2>

                <input
                    name="ISBN"
                    className="input mb-2 w-full"
                    placeholder="ISBN (10 chars)"
                    value={form.ISBN}
                    onChange={handleChange}
                />

                <select
                    name="CategoryID"
                    className="input mb-2 w-full"
                    value={form.CategoryID}
                    onChange={handleChange}
                >
                    <option value="">Select Category</option>
                    {categories.map(c => (
                        <option key={c.CategoryID} value={c.CategoryID}>
                            {c.Name}
                        </option>
                    ))}
                </select>

                <select
                    name="SupplierId"
                    className="input mb-2 w-full"
                    value={form.SupplierId}
                    onChange={handleChange}
                >
                    <option value="">Select Supplier</option>
                    {suppliers.map(s => (
                        <option key={s.SupplierId} value={s.SupplierId}>
                            {s.Name}
                        </option>
                    ))}
                </select>

                <input name="Title" className="input mb-2 w-full"
                    placeholder="Title" value={form.Title} onChange={handleChange} />

                <input name="Author" className="input mb-2 w-full"
                    placeholder="Author" value={form.Author} onChange={handleChange} />

                <input name="Price" type="number" className="input mb-2 w-full"
                    placeholder="Price" value={form.Price} onChange={handleChange} />

                <input name="Year" className="input mb-2 w-full"
                    placeholder="Year (4 chars)" value={form.Year} onChange={handleChange} />

                <input name="Edition" className="input mb-2 w-full"
                    placeholder="Edition (2 chars)" value={form.Edition} onChange={handleChange} />

                <input name="Publisher" className="input mb-2 w-full"
                    placeholder="Publisher" value={form.Publisher} onChange={handleChange} />

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
