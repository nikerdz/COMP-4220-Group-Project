import { API_BASE } from "../../api";

interface Offer {
    offerId: number;
    code: string;
    description: string | null;
    discountPercent: number;
    active: boolean;
    expiryDate: string | null;
}


interface OffersTableProps {
    offers: Offer[];
    reload: () => void;
    setEditOffer: (offer: Offer) => void;
}

export default function OffersTable({ offers, reload, setEditOffer }: OffersTableProps) {

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this offer?")) return;

        await fetch(`${API_BASE}/api/admin/offers/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });

        reload();
    };

    return (
        <table className="w-full bg-white shadow border border-gray-200 rounded">
            <thead className="bg-gray-100">
                <tr>
                    <th className="p-2 text-left">ID</th>
                    <th className="p-2 text-left">Code</th>
                    <th className="p-2 text-left">Discount %</th>
                    <th className="p-2 text-left">Active</th>
                    <th className="p-2 text-left">Expiry</th>
                    <th className="p-2 text-left">Actions</th>
                </tr>
            </thead>

            <tbody>
                {offers.map((o) => (
                    <tr key={o.offerId} className="border-t">
                        <td className="p-2">{o.offerId}</td>
                        <td className="p-2">{o.code}</td>
                        <td className="p-2">{o.discountPercent}%</td>
                        <td className="p-2">{o.active ? "✔" : "✖"}</td>
                        <td className="p-2">{o.expiryDate ?? "None"}</td>

                        <td className="p-2 flex gap-2">
                            <button
                                onClick={() => setEditOffer(o)}
                                className="px-3 py-1 bg-blue-600 text-white rounded"
                            >
                                Edit
                            </button>

                            <button
                                onClick={() => handleDelete(o.offerId)}
                                className="px-3 py-1 bg-red-600 text-white rounded"
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
