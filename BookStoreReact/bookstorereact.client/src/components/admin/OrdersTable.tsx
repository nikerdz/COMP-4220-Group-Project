import { API_BASE } from "../../api";
import type { Order } from "../../pages/AdminOrders";

interface Props {
    orders: Order[];
    reload: () => void;
    setEditOrder: (o: Order | null) => void;
}

export default function OrdersTable({ orders, reload, setEditOrder }: Props) {

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this order?")) return;

        await fetch(`${API_BASE}/api/admin/orders/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        });

        reload();
    };

    return (
        <div className="overflow-x-auto rounded-lg shadow border bg-white">
            <table className="w-full table-auto border-collapse">
                <thead className="bg-gray-100 text-gray-700 font-semibold">
                    <tr>
                        <th className="p-3 text-left w-24">Order ID</th>
                        <th className="p-3 text-left w-24">User ID</th>
                        <th className="p-3 text-left w-32">Date</th>
                        <th className="p-3 text-left w-32">Amount</th>
                        <th className="p-3 text-left w-32">Status</th>
                        <th className="p-3 text-left w-40">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {orders.map((o) => (
                        <tr
                            key={o.OrderID}
                            className="border-t hover:bg-gray-50 transition"
                        >
                            <td className="p-3">{o.OrderID}</td>

                            <td className="p-3">{o.UserID}</td>

                            <td className="p-3">
                                {new Date(o.OrderDate).toLocaleDateString()}
                            </td>

                            <td className="p-3">
                                ${Number(o.TotalAmount).toFixed(2)}
                            </td>

                            <td className="p-3">
                                <span
                                    className={
                                        "px-3 py-1 rounded-full text-sm font-medium " +
                                        (o.Status === "Pending"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : o.Status === "Processing"
                                                ? "bg-blue-100 text-blue-700"
                                                : o.Status === "Completed"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700")
                                    }
                                >
                                    {o.Status}
                                </span>
                            </td>

                            <td className="p-3">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setEditOrder(o)}
                                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                    >
                                        Update Status
                                    </button>

                                    <button
                                        onClick={() => handleDelete(o.OrderID)}
                                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
