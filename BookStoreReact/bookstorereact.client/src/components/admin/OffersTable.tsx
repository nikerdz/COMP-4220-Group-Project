import { API_BASE } from "../../api";
import type { Offer } from "../../pages/AdminOffers";

interface OfferTableProps {
    offers: Offer[];
    reload: () => void;
    setEditOffer: (o: Offer | null) => void;
}

export default function OffersTable({ offers, reload, setEditOffer }: OfferTableProps) {

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this offer?")) return;

        const res = await fetch(`${API_BASE}/api/admin/offers/${id}`, {
            method: "DELETE"
        });

        if (!res.ok) {
            alert("Failed to delete offer");
            return;
        }

        reload();
    };

    return (
        <table className="w-full bg-white shadow border border-gray-200 rounded">
            <thead className="bg-gray-100">
                <tr>
                    <th className="p-2 text-left">ID</th>
                    <th className="p-2 text-left">Code</th>
                    <th className="p-2 text-left">Description</th>
                    <th className="p-2 text-left">Discount</th>
                    <th className="p-2 text-left">Usage Limit</th>
                    <th className="p-2 text-left">Times Used</th>
                    <th className="p-2 text-left">Start</th>
                    <th className="p-2 text-left">End</th>
                    <th className="p-2 text-left">Active</th>
                    <th className="p-2 text-left">Actions</th>
                </tr>
            </thead>

            <tbody>
                {offers.map(o => (
                    <tr key={o.CouponID} className="border-t">
                        <td className="p-2">{o.CouponID}</td>
                        <td className="p-2">{o.Code}</td>
                        <td className="p-2">{o.Description ?? "—"}</td>
                        <td className="p-2">{o.DiscountRate}%</td>
                        <td className="p-2">{o.UsageLimit ?? "∞"}</td>
                        <td className="p-2">{o.TimesUsed}</td>
                        <td className="p-2">{o.StartDate?.substring(0, 10) ?? "—"}</td>
                        <td className="p-2">{o.EndDate?.substring(0, 10) ?? "—"}</td>
                        <td className="p-2">{o.IsActive ? "Yes" : "No"}</td>

                        <td className="p-2 flex gap-2">
                            <button
                                onClick={() => setEditOffer(o)}
                                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Edit
                            </button>

                            <button
                                onClick={() => handleDelete(o.CouponID)}
                                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
