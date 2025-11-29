import { useEffect, useState } from "react";
import OrdersTable from "../components/admin/OrdersTable";
import OrderItemsModal from "../components/admin/OrderItemsModal";
import { API_BASE } from "../api";

export interface Order {
    orderId: number;
    userId: number;
    userName: string;
    orderDate: string;
    totalAmount: number;
    status: string;
}

export default function AdminOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const reload = async () => {
        const res = await fetch(`${API_BASE}/api/admin/orders`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        const data = await res.json();
        setOrders(data);
    };

    useEffect(() => {
        reload().finally(() => setLoading(false));
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Orders</h1>

            {loading ? (
                <p>Loading orders...</p>
            ) : (
                <OrdersTable
                    orders={orders}
                    reload={reload}
                    setSelectedOrder={setSelectedOrder}
                />
            )}

            {selectedOrder && (
                <OrderItemsModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                />
            )}
        </div>
    );
}
