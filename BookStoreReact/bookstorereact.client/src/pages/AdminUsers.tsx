import { useEffect, useState } from "react";
import UserTable from "../components/admin/UserTable";
import UserAddModal from "../components/admin/UserAddModal";
import UserEditModal from "../components/admin/UserEditModal";
import { API_BASE } from "../api";
import type { User } from "../User";

export default function AdminUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const [showAdd, setShowAdd] = useState(false);
    const [editUser, setEditUser] = useState<User | null>(null);

    const reload = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/admin/users`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!res.ok) throw new Error("Failed to fetch users");

            const backend = await res.json();

            const converted: User[] = backend.map((u: any) => ({
                userId: u.userId,
                userName: u.userName,
                fullName: u.fullName ?? null,
                email: u.email ?? null,
                type: u.type,
                manager: u.manager,
                password: "" // UI-required field
            }));

            setUsers(converted);

        } catch (err) {
            console.error("User API error:", err);
            setUsers([]);
        }
    };

    useEffect(() => {
        reload().finally(() => setLoading(false));
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Users</h1>
                <button
                    onClick={() => setShowAdd(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    + Add User
                </button>
            </div>

            {loading ? (
                <p>Loading users...</p>
            ) : (
                <UserTable
                    users={users}
                    reload={reload}
                    setEditUser={setEditUser}
                />
            )}

            {showAdd && (
                <UserAddModal
                    onClose={() => setShowAdd(false)}
                    reload={reload}
                />
            )}

            {editUser && (
                <UserEditModal
                    user={editUser}
                    onClose={() => setEditUser(null)}
                    reload={reload}
                />
            )}
        </div>
    );
}
