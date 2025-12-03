import { useEffect, useState } from "react";
import AdminStats from "../components/admin/AdminStats";
import AdminQuickActions from "../components/admin/AdminQuickActions";
import AdminRecentActivity from "../components/admin/AdminRecentActivity";
import { API_BASE } from "../api";

// Backend returns PascalCase, so match exactly:
interface DashboardStats {
    TotalUsers: number;
    TotalOrders: number;
    PendingOrders: number;
    TotalBooks: number;
    TotalSuppliers: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState([
        { label: "Total Users", value: 0 },
        { label: "Total Orders", value: 0 },
        { label: "Pending Orders", value: 0 },
        { label: "Books in Inventory", value: 0 },
        { label: "Suppliers", value: 0 },
    ]);

    const loadStats = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/admin/dashboard/stats`, {
                headers: {
                    "Content-Type": "application/json"
                    // No token — same rules as all other admin modules
                }
            });

            if (!res.ok) throw new Error("Dashboard API error");

            const data: DashboardStats = await res.json();

            setStats([
                { label: "Total Users", value: data.TotalUsers },
                { label: "Total Orders", value: data.TotalOrders },
                { label: "Pending Orders", value: data.PendingOrders },
                { label: "Books in Inventory", value: data.TotalBooks },
                { label: "Suppliers", value: data.TotalSuppliers },
            ]);

        } catch (err) {
            console.error("Failed to load dashboard stats:", err);
            // Keep UI safe
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
        loadStats();
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

            {/* Stats Section */}
            <AdminStats stats={stats} />

            {/* Quick Actions */}
            <AdminQuickActions />

            {/* Recent Activity (static for now) */}
            <AdminRecentActivity />
        </div>
    );
}
