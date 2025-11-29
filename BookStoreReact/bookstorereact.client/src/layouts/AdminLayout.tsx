import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AdminSidebar from "../components/admin/AdminSidebar";

export default function AdminLayout() {
    const navigate = useNavigate();

    useEffect(() => {
        // Get user from localStorage
        const raw = localStorage.getItem("user");
        const user = raw ? JSON.parse(raw) : null;

        // Redirect non-admin or missing user
        if (!user || user.type !== "AD") {
            navigate("/", { replace: true });
        }
    }, [navigate]);

    return (
        <div className="min-h-screen flex bg-gray-100">

            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-xl border-r">
                <AdminSidebar />
            </aside>

            {/* Main content */}
            <main className="flex-1 p-8">
                <Outlet />
            </main>
        </div>
    );
}
