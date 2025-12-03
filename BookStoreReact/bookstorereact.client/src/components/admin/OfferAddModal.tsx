import { useState } from "react";
import { API_BASE } from "../../api";

interface AddProps {
    onClose: () => void;
    reload: () => void;
}

export default function OfferAddModal({ onClose, reload }: AddProps) {
    const [form, setForm] = useState({
        Code: "",
        Description: "",
        DiscountRate: "",
        UsageLimit: "",
        StartDate: "",
        EndDate: "",
        IsActive: true
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
        if (!form.Code) return alert("Code is required");
        if (!form.DiscountRate) return alert("Discount is required");

        const payload = {
            Code: form.Code,
            Description: form.Description || null,
            DiscountRate: Number(form.DiscountRate),
            UsageLimit: form.UsageLimit === "" ? null : Number(form.UsageLimit),
            StartDate: form.StartDate === "" ? null : form.StartDate,
            EndDate: form.EndDate === "" ? null : form.EndDate,
            IsActive: form.IsActive
        };

        const res = await fetch(`${API_BASE}/api/admin/offers`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            alert("Failed to add offer");
            return;
        }

        reload();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
            <div className="bg-white p-6 w-96 rounded shadow">
                <h2 className="text-xl font-bold mb-4">Add Offer</h2>

                <input name="Code" className="input mb-2 w-full" placeholder="Code"
                    value={form.Code} onChange={handleChange} />

                <input name="Description" className="input mb-2 w-full" placeholder="Description"
                    value={form.Description} onChange={handleChange} />

                <input name="DiscountRate" type="number" className="input mb-2 w-full"
                    placeholder="Discount Rate"
                    value={form.DiscountRate} onChange={handleChange} />

                <input name="UsageLimit" type="number" className="input mb-2 w-full"
                    placeholder="Usage Limit"
                    value={form.UsageLimit} onChange={handleChange} />

                <input name="StartDate" type="date" className="input mb-2 w-full"
                    value={form.StartDate} onChange={handleChange} />

                <input name="EndDate" type="date" className="input mb-2 w-full"
                    value={form.EndDate} onChange={handleChange} />

                <label className="flex items-center gap-2 mb-4">
                    <input type="checkbox" name="IsActive" checked={form.IsActive}
                        onChange={handleChange} />
                    Active
                </label>

                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
                </div>
            </div>
        </div>
    );
}
