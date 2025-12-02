import { useState } from "react";
import type { Offer } from "../../pages/AdminOffers";
import { API_BASE } from "../../api";

interface EditProps {
    offer: Offer;
    onClose: () => void;
    reload: () => void;
}

export default function OfferEditModal({ offer, onClose, reload }: EditProps) {
    const [form, setForm] = useState({
        CouponID: offer.CouponID,
        Code: offer.Code,
        Description: offer.Description ?? "",
        DiscountRate: offer.DiscountRate.toString(),
        UsageLimit: offer.UsageLimit?.toString() ?? "",
        StartDate: offer.StartDate ?? "",
        EndDate: offer.EndDate ?? "",
        IsActive: offer.IsActive
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;

        if (type === "checkbox") {
            setForm(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
            return;
        }

        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        const payload = {
            CouponID: form.CouponID,
            Code: form.Code,
            Description: form.Description || null,
            DiscountRate: Number(form.DiscountRate),
            UsageLimit: form.UsageLimit === "" ? null : Number(form.UsageLimit),
            StartDate: form.StartDate === "" ? null : form.StartDate,
            EndDate: form.EndDate === "" ? null : form.EndDate,
            IsActive: form.IsActive
        };

        const res = await fetch(`${API_BASE}/api/admin/offers/${form.CouponID}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            alert("Failed to update offer");
            return;
        }

        reload();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
            <div className="bg-white p-6 w-96 rounded shadow">
                <h2 className="text-xl font-bold mb-4">Edit Offer</h2>

                <input className="input mb-2 w-full" disabled value={form.CouponID} />

                <input name="Code" className="input mb-2 w-full" value={form.Code}
                    onChange={handleChange} />

                <input name="Description" className="input mb-2 w-full"
                    value={form.Description} onChange={handleChange} />

                <input name="DiscountRate" type="number" className="input mb-2 w-full"
                    value={form.DiscountRate} onChange={handleChange} />

                <input name="UsageLimit" type="number" className="input mb-2 w-full"
                    value={form.UsageLimit} onChange={handleChange} />

                <input name="StartDate" type="date" className="input mb-2 w-full"
                    value={form.StartDate?.substring(0, 10) ?? ""} onChange={handleChange} />

                <input name="EndDate" type="date" className="input mb-2 w-full"
                    value={form.EndDate?.substring(0, 10) ?? ""} onChange={handleChange} />

                <label className="flex items-center gap-2 mb-4">
                    <input type="checkbox" name="IsActive"
                        checked={form.IsActive} onChange={handleChange} />
                    Active
                </label>

                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
                </div>
            </div>
        </div>
    );
}
