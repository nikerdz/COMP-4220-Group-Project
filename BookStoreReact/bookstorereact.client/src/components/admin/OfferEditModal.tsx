import { useState } from "react";
import { API_BASE } from "../../api";

interface Offer {
    offerId: number;
    code: string;
    description: string | null;
    discountPercent: number;
    active: boolean;
    expiryDate: string | null;
}

interface OfferEditModalProps {
    offer: Offer;
    onClose: () => void;
    reload: () => void;
}

export default function OfferEditModal({ offer, onClose, reload }: OfferEditModalProps) {
    const [form, setForm] = useState({
        code: offer.code,
        description: offer.description ?? "",
        discountPercent: offer.discountPercent.toString(),
        active: offer.active,
        expiryDate: offer.expiryDate ?? ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSave = async () => {
        const payload = {
            code: form.code,
            description: form.description,
            discountPercent: Number(form.discountPercent),
            active: form.active,
            expiryDate: form.expiryDate || null
        };

        const res = await fetch(`${API_BASE}/api/admin/offers/${offer.offerId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            reload();
            onClose();
        } else {
            alert("Failed to update offer.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
            <div className="bg-white p-6 w-96 rounded shadow">
                <h2 className="text-xl font-bold mb-4">Edit Offer</h2>

                <input
                    name="code"
                    className="input mb-2 w-full"
                    value={form.code}
                    onChange={handleChange}
                />

                <input
                    name="description"
                    className="input mb-2 w-full"
                    value={form.description}
                    onChange={handleChange}
                />

                <input
                    name="discountPercent"
                    type="number"
                    className="input mb-2 w-full"
                    value={form.discountPercent}
                    onChange={handleChange}
                />

                <label className="flex items-center gap-2 mb-2">
                    <input
                        type="checkbox"
                        name="active"
                        checked={form.active}
                        onChange={handleChange}
                    />
                    <span>Active</span>
                </label>

                <input
                    name="expiryDate"
                    type="date"
                    className="input mb-4 w-full"
                    value={form.expiryDate}
                    onChange={handleChange}
                />

                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
                        Cancel
                    </button>

                    <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded">
                        Update
                    </button>
                </div>
            </div>
        </div>
    );
}
