import { useEffect, useState } from "react";
import AdminStats from "../components/admin/AdminStats";
import AdminQuickActions from "../components/admin/AdminQuickActions";
import AdminRecentActivity from "../components/admin/AdminRecentActivity";
import { API_BASE } from "../api";

interface DashboardStats {
    totalUsers: number;
    totalOrders: number;
    pendingOrders: number;
    totalBooks: number;
    totalSuppliers: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState([
        { label: "Total Users", value: 0 },
        { label: "Total Orders", value: 0 },
        { label: "Pending Orders", value: 0 },
        { label: "Books in Inventory", value: 0 },
        { label: "Suppliers", value: 0 },
    ]);

    const reload = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/admin/dashboard/stats`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (!res.ok) throw new Error("Dashboard API error");

            const data: DashboardStats = await res.json();

            setStats([
                { label: "Total Users", value: data.totalUsers },
                { label: "Total Orders", value: data.totalOrders },
                { label: "Pending Orders", value: data.pendingOrders },
                { label: "Books in Inventory", value: data.totalBooks },
                { label: "Suppliers", value: data.totalSuppliers },
            ]);

        } catch (err) {
            console.error("Failed to load dashboard stats:", err);

            setStats([
                { label: "Total Users", value: 0 },
                { label: "Total Orders", value: 0 },
                { label: "Pending Orders", value: 0 },
                { label: "Books in Inventory", value: 0 },
                { label: "Suppliers", value: 0 },
            ]);
        }
    };

    useEffect(() => {
        reload();
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

            {/* Stats */}
            <AdminStats stats={stats} />

            {/* Quick actions */}
            <AdminQuickActions />

            {/* Recent activity */}
            <AdminRecentActivity />
        </div>
    );
}
