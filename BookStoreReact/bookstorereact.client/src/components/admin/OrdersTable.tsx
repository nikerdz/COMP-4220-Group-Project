import React from "react";

interface Order {
    OrderID: number;
    UserID: number;
    OrderDate: string;
    TotalAmount?: number | null;
    SubtotalAmount?: number | null;
    TaxAmount?: number | null;
    DeliveryFee?: number | null;
    Status?: string;
    PaymentMethod?: string | null;
}

interface Props {
    orders: Order[];
}

export default function OrdersTable({ orders }: Props) {
    return (
        <table className="w-full bg-white shadow border border-gray-200 rounded">
            <thead className="bg-gray-100">
                <tr>
                    <th className="p-2 text-left">Order ID</th>
                    <th className="p-2 text-left">User ID</th>
                    <th className="p-2 text-left">Date</th>
                    <th className="p-2 text-left">Total ($)</th>
                    <th className="p-2 text-left">Status</th>
                    <th className="p-2 text-left">Payment</th>
                </tr>
            </thead>

            <tbody>
                {orders.map((o) => (
                    <tr key={o.OrderID} className="border-t">
                        <td className="p-2">{o.OrderID}</td>
                        <td className="p-2">{o.UserID}</td>
                        <td className="p-2">
                            {new Date(o.OrderDate).toLocaleDateString()}
                        </td>

                        {/* FIXED: Prevent crashes if TotalAmount is null/undefined */}
                        <td className="p-2">
                            {o.TotalAmount != null
                                ? o.TotalAmount.toFixed(2)
                                : "0.00"}
                        </td>

                        <td className="p-2">{o.Status ?? "N/A"}</td>
                        <td className="p-2">{o.PaymentMethod ?? "N/A"}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
