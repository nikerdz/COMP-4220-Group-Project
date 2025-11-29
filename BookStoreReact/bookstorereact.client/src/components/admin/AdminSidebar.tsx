import { NavLink } from "react-router-dom";

interface AdminLink {
    label: string;
    to: string;
}

export default function AdminSidebar() {
    const links: AdminLink[] = [
        { label: "Dashboard", to: "/admin" },
        { label: "Inventory", to: "/admin/inventory" },
        { label: "Categories", to: "/admin/categories" },
        { label: "Offers", to: "/admin/offers" },
        { label: "Users", to: "/admin/users" },
        { label: "Orders", to: "/admin/orders" },
        { label: "Suppliers", to: "/admin/suppliers" }
    ];

    return (
        <div className="px-6 py-8">
            <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

            <nav className="space-y-3">
                {links.map((link: AdminLink) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }: { isActive: boolean }) =>
                            "block py-2 px-3 rounded-lg text-sm " +
                            (isActive
                                ? "bg-green-600 text-white"
                                : "text-gray-700 hover:bg-gray-200")
                        }
                    >
                        {link.label}
                    </NavLink>
                ))}
            </nav>
        </div>
    );
}
