import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AdminSidebar from "../components/admin/AdminSidebar";

export default function AdminLayout() {
    const navigate = useNavigate();

    useEffect(() => {
        const raw = localStorage.getItem("user");
        const user = raw ? JSON.parse(raw) : null;

        // Redirect if no user OR not admin
        if (!user || user.type !== "AD") {
            navigate("/", { replace: true });
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/", { replace: true });
    };

    return (
        <div className="min-h-screen flex bg-gray-100">

            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-xl border-r">
                <AdminSidebar />
            </aside>

            {/* Main content */}
            <main className="flex-1 p-8">

                {/* Logout button aligned to top-right */}
                <div className="flex justify-end mb-6">
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg shadow 
                                   hover:bg-red-700 transition"
                    >
                        Logout
                    </button>
                </div>

                <Outlet />
            </main>
        </div>
    );
}
