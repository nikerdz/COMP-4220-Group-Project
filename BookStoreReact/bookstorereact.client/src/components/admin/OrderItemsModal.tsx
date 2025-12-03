import { useState } from "react";
import { API_BASE } from "../../api";
import type { Order } from "../../pages/AdminOrders";

interface Props {
    order: Order;
    onClose: () => void;
    reload: () => void;
}

export default function OrderItemsModal({ order, onClose, reload }: Props) {
    const [status, setStatus] = useState(order.Status);

    const handleSave = async () => {
        const payload = { Status: status };

        const res = await fetch(`${API_BASE}/api/admin/orders/${order.OrderID}/status`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const msg = await res.text();
            alert("Failed to update status: " + msg);
            return;
        }

        reload();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
            <div className="bg-white p-6 w-96 rounded shadow">
                <h2 className="text-xl font-bold mb-4">Update Order Status</h2>

                <select
                    className="input mb-4 w-full"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                </select>

                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
                        Cancel
                    </button>

                    <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
