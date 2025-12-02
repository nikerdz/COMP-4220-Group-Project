import { API_BASE } from "../../api";

interface UserAdmin {
    UserID: number;
    UserName: string;
    FullName: string | null;
    Email: string | null;
    Type: string;
    Manager: boolean;
}

interface UserTableProps {
    users: UserAdmin[];
    reload: () => void;
    setEditUser: (u: UserAdmin | null) => void;
}

export default function UserTable({ users, reload, setEditUser }: UserTableProps) {
    const handleDelete = async (id: number) => {
        if (!confirm("Delete this user?")) return;

        const res = await fetch(`${API_BASE}/api/admin/users/${id}`, {
            method: "DELETE"
        });

        if (!res.ok) {
            alert("Failed to delete user.");
            return;
        }

        reload();
    };

    return (
        <table className="w-full bg-white shadow border border-gray-200 rounded">
            <thead className="bg-gray-100">
                <tr>
                    <th className="p-2 text-left">ID</th>
                    <th className="p-2 text-left">Username</th>
                    <th className="p-2 text-left">Full Name</th>
                    <th className="p-2 text-left">Email</th>
                    <th className="p-2 text-left">Type</th>
                    <th className="p-2 text-left">Manager</th>
                    <th className="p-2 text-left">Actions</th>
                </tr>
            </thead>

            <tbody>
                {users.map((u) => (
                    <tr key={u.UserID} className="border-t">
                        <td className="p-2">{u.UserID}</td>
                        <td className="p-2">{u.UserName}</td>
                        <td className="p-2">{u.FullName ?? "—"}</td>
                        <td className="p-2">{u.Email ?? "—"}</td>
                        <td className="p-2">{u.Type}</td>
                        <td className="p-2">{u.Manager ? "Yes" : "No"}</td>

                        <td className="p-2 flex gap-2">
                            <button
                                onClick={() => setEditUser(u)}
                                className="px-3 py-1 bg-blue-600 text-white rounded"
                            >
                                Edit
                            </button>

                            <button
                                onClick={() => handleDelete(u.UserID)}
                                className="px-3 py-1 bg-red-600 text-white rounded"
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
