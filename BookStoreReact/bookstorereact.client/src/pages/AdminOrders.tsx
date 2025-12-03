import { useEffect, useState } from "react";
import { API_BASE } from "../api";
import OrdersTable from "../components/admin/OrdersTable";
import EditOrderStatusModal from "../components/admin/OrderItemsModal";

export interface Order {
    OrderID: number;
    UserID: number;
    OrderDate: string;
    TotalAmount: number;
    Status: string;
    PaymentMethod: string | null;
}

export default function AdminOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    const [editOrder, setEditOrder] = useState<Order | null>(null);

    const loadData = () => {
        return fetch(`${API_BASE}/api/admin/orders`)
            .then(res => res.json())
            .then(data => setOrders(data))
            .catch(() => setOrders([]));
    };

    useEffect(() => {
        loadData().finally(() => setLoading(false));
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Orders</h1>

            {loading ? (
                <p>Loading orders...</p>
            ) : (
                <OrdersTable
                    orders={orders}
                    reload={loadData}
                    setEditOrder={setEditOrder}
                />
            )}

            {editOrder && (
                <EditOrderStatusModal
                    order={editOrder}
                    onClose={() => setEditOrder(null)}
                    reload={loadData}
                />
            )}
        </div>
    );
}
