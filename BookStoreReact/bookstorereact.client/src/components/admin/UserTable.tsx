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
        <div className="overflow-x-auto rounded-lg shadow border bg-white">
            <table className="w-full table-auto border-collapse">
                <thead className="bg-gray-100 text-gray-700 font-semibold">
                    <tr>
                        <th className="p-3 text-center w-20">ID</th>
                        <th className="p-3 text-left w-40">Username</th>
                        <th className="p-3 text-left w-56">Full Name</th>
                        <th className="p-3 text-left w-64">Email</th>
                        <th className="p-3 text-center w-28">Type</th>
                        <th className="p-3 text-center w-24">Manager</th>
                        <th className="p-3 text-center w-40">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {users.map((u) => (
                        <tr
                            key={u.UserID}
                            className="border-t hover:bg-gray-50 transition"
                        >
                            <td className="p-3 text-center">{u.UserID}</td>

                            <td className="p-3">{u.UserName}</td>

                            <td className="p-3">{u.FullName ?? "—"}</td>

                            <td className="p-3">{u.Email ?? "—"}</td>

                            <td className="p-3 text-center">{u.Type}</td>

                            <td className="p-3 text-center">
                                {u.Manager ? "Yes" : "No"}
                            </td>

                            <td className="p-3">
                                <div className="flex justify-center gap-2">
                                    <button
                                        onClick={() => setEditUser(u)}
                                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => handleDelete(u.UserID)}
                                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
