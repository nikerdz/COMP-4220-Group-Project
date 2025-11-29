import { useEffect, useState } from "react";
import OffersTable from "../components/admin/OffersTable";
import OfferAddModal from "../components/admin/OfferAddModal";
import OfferEditModal from "../components/admin/OfferEditModal";
import { API_BASE } from "../api";

export interface Offer {
    offerId: number;
    code: string;
    description: string | null;
    discountPercent: number;
    active: boolean;
    expiryDate: string | null;
}

export default function AdminOffers() {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [editOffer, setEditOffer] = useState<Offer | null>(null);

    const reload = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/admin/offers`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            if (!res.ok) throw new Error("Failed to load offers");

            setOffers(await res.json());
        } catch (err) {
            console.error("API Error (offers):", err);
            setOffers([]);
        }
    };

    useEffect(() => {
        reload().finally(() => setLoading(false));
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Offers / Coupons</h1>
                <button
                    onClick={() => setShowAdd(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    + Add Offer
                </button>
            </div>

            {loading ? (
                <p>Loading offers...</p>
            ) : (
                <OffersTable
                    offers={offers}
                    reload={reload}
                    setEditOffer={setEditOffer}
                />
            )}

            {showAdd && (
                <OfferAddModal
                    onClose={() => setShowAdd(false)}
                    reload={reload}
                />
            )}

            {editOffer && (
                <OfferEditModal
                    offer={editOffer}
                    onClose={() => setEditOffer(null)}
                    reload={reload}
                />
            )}
        </div>
    );
}
