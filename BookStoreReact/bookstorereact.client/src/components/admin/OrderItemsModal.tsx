import { useEffect, useState } from "react";
import { API_BASE } from "../../api";

interface OrderItem {
    isbn: string;
    title: string;
    price: number;
    quantity: number;
}

interface Order {
    orderId: number;
}

interface OrderItemsModalProps {
    order: Order;
    onClose: () => void;
}

export default function OrderItemsModal({ order, onClose }: OrderItemsModalProps) {
    const [items, setItems] = useState<OrderItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadItems() {
            try {
                const res = await fetch(
                    `${API_BASE}/api/admin/orders/${order.orderId}/items`,
                    {
                        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                    }
                );
                const data: OrderItem[] = await res.json();
                setItems(data);
            } catch (err) {
                console.error("Failed to load order items", err);
            } finally {
                setLoading(false);
            }
        }

        loadItems();
    }, [order.orderId]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
            <div className="bg-white p-6 w-[500px] rounded shadow max-h-[80vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">
                    Order #{order.orderId} Items
                </h2>

                {loading ? (
                    <p>Loading items...</p>
                ) : (
                    <table className="w-full mb-4 border">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2 text-left">ISBN</th>
                                <th className="p-2 text-left">Title</th>
                                <th className="p-2 text-left">Qty</th>
                                <th className="p-2 text-left">Price</th>
                            </tr>
                        </thead>

                        <tbody>
                            {items.map((it) => (
                                <tr key={it.isbn} className="border-t">
                                    <td className="p-2">{it.isbn}</td>
                                    <td className="p-2">{it.title}</td>
                                    <td className="p-2">{it.quantity}</td>
                                    <td className="p-2">${it.price.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                <div className="flex justify-end">
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
