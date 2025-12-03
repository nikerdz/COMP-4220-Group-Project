import { useEffect, useState } from "react";
import { API_BASE } from "../../api";
import type { Book } from "../../pages/AdminInventory";

interface Category {
    CategoryID: number;
    Name: string;
}

interface Supplier {
    SupplierID: number;
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
        isbn: book.isbn,
        categoryID: String(book.categoryID),
        supplierId: book.supplierId ? String(book.supplierId) : "",
        title: book.title ?? "",
        author: book.author ?? "",
        price: String(book.price),
        year: book.year ?? "",
        edition: book.edition ?? "",
        publisher: book.publisher ?? "",
        inStock: String(book.inStock),
    });

    // Load dropdown lists
    useEffect(() => {
        async function loadLists() {
            try {
                const catRes = await fetch(`${API_BASE}/api/admin/categories`);
                const supRes = await fetch(`${API_BASE}/api/admin/suppliers`);

                const catData = await catRes.json();
                const supData = await supRes.json();

                setCategories(catData);

                // Normalize SupplierID casing
                setSuppliers(
                    supData.map((s: any) => ({
                        SupplierID: s.SupplierID,
                        Name: s.Name,
                    }))
                );
            } catch (err) {
                console.error("Failed to load categories or suppliers:", err);
            }
        }

        loadLists();
    }, []);

    // Generic handler
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = async () => {
        // BASIC VALIDATION
        if (form.isbn.length !== 10) return alert("ISBN must be 10 characters.");
        if (!form.categoryID) return alert("Category is required.");
        if (form.year.length !== 4) return alert("Year must be 4 chars.");
        if (form.edition.length !== 2) return alert("Edition must be 2 chars.");

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

        const res = await fetch(`${API_BASE}/api/admin/books/${book.isbn}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({ error: "Unknown error" }));
            alert("Failed to update book: " + err.error);
            return;
        }

        reload();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
            <div className="bg-white p-6 w-96 rounded shadow">
                <h2 className="text-xl font-bold mb-4">Edit Book</h2>

                {/* ISBN */}
                <input
                    className="input mb-2 w-full"
                    name="isbn"
                    placeholder="ISBN (10 chars)"
                    value={form.isbn}
                    onChange={handleChange}
                />

                {/* Category */}
                <select
                    className="input mb-2 w-full"
                    name="categoryID"
                    value={form.categoryID}
                    onChange={handleChange}
                >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                        <option key={c.CategoryID} value={c.CategoryID}>
                            {c.Name}
                        </option>
                    ))}
                </select>

                {/* Supplier */}
                <select
                    className="input mb-2 w-full"
                    name="supplierId"
                    value={form.supplierId}
                    onChange={handleChange}
                >
                    <option value="">Select Supplier</option>
                    {suppliers.map((s) => (
                        <option key={s.SupplierID} value={s.SupplierID}>
                            {s.Name}
                        </option>
                    ))}
                </select>

                {/* Other Inputs */}
                <input
                    className="input mb-2 w-full"
                    name="title"
                    placeholder="Title"
                    value={form.title}
                    onChange={handleChange}
                />

                <input
                    className="input mb-2 w-full"
                    name="author"
                    placeholder="Author"
                    value={form.author}
                    onChange={handleChange}
                />

                <input
                    className="input mb-2 w-full"
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={form.price}
                    onChange={handleChange}
                />

                <input
                    className="input mb-2 w-full"
                    name="year"
                    placeholder="Year (4 chars)"
                    value={form.year}
                    onChange={handleChange}
                />

                <input
                    className="input mb-2 w-full"
                    name="edition"
                    placeholder="Edition (2 chars)"
                    value={form.edition}
                    onChange={handleChange}
                />

                <input
                    className="input mb-2 w-full"
                    name="publisher"
                    placeholder="Publisher"
                    value={form.publisher}
                    onChange={handleChange}
                />

                <input
                    className="input mb-4 w-full"
                    type="number"
                    name="inStock"
                    placeholder="In Stock"
                    value={form.inStock}
                    onChange={handleChange}
                />

                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-green-600 text-white rounded"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
