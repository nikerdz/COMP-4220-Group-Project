import { API_BASE } from "../../api";
import type { User } from "../../User";


interface UserTableProps {
    users: User[];
    reload: () => void;
    setEditUser: (u: User) => void;
}

export default function UserTable({ users, reload, setEditUser }: UserTableProps) {

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this user?")) return;

        await fetch(`${API_BASE}/api/admin/users/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });

        reload();
    };

    return (
        <table className="w-full bg-white shadow border border-gray-200 rounded">
            <thead className="bg-gray-100">
                <tr>
                    <th className="p-2 text-left">ID</th>
                    <th className="p-2 text-left">Username</th>
                    <th className="p-2 text-left">Type</th>
                    <th className="p-2 text-left">Manager</th>
                    <th className="p-2 text-left">Full Name</th>
                    <th className="p-2 text-left">Email</th>
                    <th className="p-2 text-left">Actions</th>
                </tr>
            </thead>

            <tbody>
                {users.map((u) => (
                    <tr key={u.userId} className="border-t">
                        <td className="p-2">{u.userId}</td>
                        <td className="p-2">{u.userName}</td>
                        <td className="p-2">{u.type}</td>
                        <td className="p-2">{u.manager ? "✔" : "✖"}</td>
                        <td className="p-2">{u.fullName || "—"}</td>
                        <td className="p-2">{u.email || "—"}</td>

                        <td className="p-2 flex gap-2">
                            <button
                                onClick={() => setEditUser(u)}
                                className="px-3 py-1 bg-blue-600 text-white rounded"
                            >
                                Edit
                            </button>

                            <button
                                onClick={() => handleDelete(u.userId)}
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
