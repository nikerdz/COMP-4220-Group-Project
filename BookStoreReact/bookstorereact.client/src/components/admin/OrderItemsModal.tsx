import { useEffect, useState } from "react";
import { API_BASE } from "../../api";

interface Props {
    orderId: number;
    onClose: () => void;
}

export default function OrderItemsModal({ orderId, onClose }: Props) {
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_BASE}/api/admin/orders/${orderId}`)
            .then((res) => res.json())
            .then((data) => setOrder(data))
            .finally(() => setLoading(false));
    }, [orderId]);

    if (loading) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
            <div className="bg-white p-6 w-[600px] rounded shadow max-h-[90vh] overflow-auto">
                <h2 className="text-xl font-bold mb-4">Order #{order.orderID}</h2>

                <p><strong>User:</strong> {order.userID}</p>
                <p><strong>Date:</strong> {order.orderDate}</p>
                <p><strong>Status:</strong> {order.status}</p>
                <p><strong>Total:</strong> ${order.totalAmount}</p>
                <p><strong>Email:</strong> {order.email ?? "N/A"}</p>

                <h3 className="text-lg font-semibold mt-4 mb-2">Items</h3>

                <table className="w-full border">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2">ISBN</th>
                            <th className="p-2">Title</th>
                            <th className="p-2">Price</th>
                            <th className="p-2">Qty</th>
                            <th className="p-2">Subtotal</th>
                        </tr>
                    </thead>

                    <tbody>
                        {order.items.map((it: any) => (
                            <tr key={it.orderItemID} className="border-t">
                                <td className="p-2">{it.isbn}</td>
                                <td className="p-2">{it.title}</td>
                                <td className="p-2">${it.price}</td>
                                <td className="p-2">{it.quantity}</td>
                                <td className="p-2">${it.subtotal}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="flex justify-end mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 rounded"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
