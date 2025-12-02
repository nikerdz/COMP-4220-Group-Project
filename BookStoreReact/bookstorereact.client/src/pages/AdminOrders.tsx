import { useEffect, useState } from "react";
import { API_BASE } from "../api";
import OrderTable from "../components/admin/OrdersTable";
import OrderDetailsModal from "../components/admin/OrderItemsModal";

export interface Order {
    orderID: number;
    userID: number;
    orderDate: string;
    totalAmount: number;
    subtotalAmount: number;
    taxAmount: number;
    deliveryFee: number;
    status: string;
    shippingAddress: string | null;
    paymentMethod: string | null;
    email: string | null;
}

export default function AdminOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<number | null>(null);

    const loadData = () =>
        fetch(`${API_BASE}/api/admin/orders`)
            .then((res) => res.json())
            .then((data) => setOrders(data))
            .catch(() => setOrders([]));

    useEffect(() => {
        loadData().finally(() => setLoading(false));
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Orders</h1>

            {loading ? (
                <p>Loading orders...</p>
            ) : (
                <OrderTable
                    orders={orders}
                    reload={loadData}
                    setSelectedOrder={setSelectedOrder}
                />
            )}

            {selectedOrder !== null && (
                <OrderDetailsModal
                    orderId={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                />
            )}
        </div>
    );
}
