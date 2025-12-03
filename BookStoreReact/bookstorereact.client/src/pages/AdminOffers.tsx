import { useEffect, useState } from "react";
import { API_BASE } from "../api";

import OfferTable from "../components/admin/OffersTable";
import OfferAddModal from "../components/admin/OfferAddModal";
import OfferEditModal from "../components/admin/OfferEditModal";

export interface Offer {
    CouponID: number;
    Code: string;
    Description: string | null;
    DiscountRate: number;
    UsageLimit: number | null;
    TimesUsed: number;
    StartDate: string | null;
    EndDate: string | null;
    IsActive: boolean;
}

export default function AdminOffers() {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(true);

    const [showAdd, setShowAdd] = useState(false);
    const [editOffer, setEditOffer] = useState<Offer | null>(null);

    const loadData = () => {
        return fetch(`${API_BASE}/api/admin/offers`)
            .then(res => res.json())
            .then(data => setOffers(data))
            .catch(() => setOffers([]));
    };

    useEffect(() => {
        loadData().finally(() => setLoading(false));
    }, []);

    return (
        <div className="p-2">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Offers</h1>

                <button
                    onClick={() => setShowAdd(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    + Add Offer
                </button>
            </div>

            {/* Scrollable table wrapper */}
            <div className="max-h-[600px] overflow-y-auto border rounded shadow bg-white">
                {loading ? (
                    <p className="p-4">Loading offers...</p>
                ) : (
                    <OfferTable
                        offers={offers}
                        reload={loadData}
                        setEditOffer={setEditOffer}
                    />
                )}
            </div>

            {/* Add modal */}
            {showAdd && (
                <OfferAddModal
                    onClose={() => setShowAdd(false)}
                    reload={loadData}
                />
            )}

            {/* Edit modal */}
            {editOffer && (
                <OfferEditModal
                    offer={editOffer}
                    onClose={() => setEditOffer(null)}
                    reload={loadData}
                />
            )}
        </div>
    );
}
