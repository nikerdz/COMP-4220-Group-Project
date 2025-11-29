import { Link } from "react-router-dom";

interface QuickAction {
    label: string;
    to: string;
    color: string;
}

export default function AdminQuickActions() {
    const actions: QuickAction[] = [
        { label: "Add Book", to: "/admin/inventory", color: "bg-blue-600" },
        { label: "View Orders", to: "/admin/orders", color: "bg-green-600" },
        { label: "Manage Users", to: "/admin/users", color: "bg-purple-600" },
        { label: "Manage Offers", to: "/admin/offers", color: "bg-orange-600" },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {actions.map((a, i) => (
                <Link
                    key={i}
                    to={a.to}
                    className={`${a.color} text-white p-4 rounded-xl shadow hover:opacity-90 transition`}
                >
                    <p className="text-lg font-semibold">{a.label}</p>
                </Link>
            ))}
        </div>
    );
}
