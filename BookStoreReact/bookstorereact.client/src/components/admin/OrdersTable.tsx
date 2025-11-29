import { API_BASE } from "../../api";

export interface Order {
    orderId: number;
    userId: number;
    userName: string;
    orderDate: string;
    totalAmount: number;
    status: string;
}

interface OrdersTableProps {
    orders: Order[];
    reload: () => void;
    setSelectedOrder: (order: Order) => void;
}

export default function OrdersTable({
    orders,
    reload,
    setSelectedOrder
}: OrdersTableProps) {

    const updateStatus = async (orderId: number, newStatus: string) => {
        await fetch(`${API_BASE}/api/admin/orders/${orderId}/status`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ status: newStatus })
        });

        reload();
    };

    return (
        <table className="w-full bg-white shadow border border-gray-200 rounded">
            <thead className="bg-gray-100">
                <tr>
                    <th className="p-2 text-left">Order ID</th>
                    <th className="p-2 text-left">User Name</th>
                    <th className="p-2 text-left">Order Date</th>
                    <th className="p-2 text-left">Total</th>
                    <th className="p-2 text-left">Status</th>
                    <th className="p-2 text-left">Actions</th>
                </tr>
            </thead>

            <tbody>
                {orders.map((order) => (
                    <tr key={order.orderId} className="border-t">
                        <td className="p-2">{order.orderId}</td>
                        <td className="p-2">{order.userName}</td>
                        <td className="p-2">{order.orderDate}</td>
                        <td className="p-2">${order.totalAmount.toFixed(2)}</td>

                        <td className="p-2">
                            <select
                                value={order.status}
                                onChange={(e) =>
                                    updateStatus(order.orderId, e.target.value)
                                }
                                className="border rounded px-2 py-1"
                            >
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </td>

                        <td className="p-2">
                            <button
                                onClick={() => setSelectedOrder(order)}
                                className="px-3 py-1 bg-blue-600 text-white rounded"
                            >
                                View Items
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
