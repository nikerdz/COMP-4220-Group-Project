import { useEffect, useState } from "react";
import { API_BASE } from "../api";
import UserTable from "../components/admin/UserTable";
import AddUserModal from "../components/admin/UserAddModal";
import EditUserModal from "../components/admin/UserEditModal";

interface UserAdmin {
    UserID: number;
    UserName: string;
    FullName: string | null;
    Email: string | null;
    Type: string;
    Manager: boolean;
}

export default function AdminUsers() {
    const [users, setUsers] = useState<UserAdmin[]>([]);
    const [loading, setLoading] = useState(true);

    const [showAdd, setShowAdd] = useState(false);
    const [editUser, setEditUser] = useState<UserAdmin | null>(null);

    const loadData = () => {
        return fetch(`${API_BASE}/api/admin/users`)
            .then(res => res.json())
            .then(data => setUsers(data))
            .catch(() => setUsers([]));
    };

    useEffect(() => {
        loadData().finally(() => setLoading(false));
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Users</h1>

                <button
                    onClick={() => setShowAdd(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                >
                    + Add User
                </button>
            </div>

            {loading ? (
                <p>Loading users...</p>
            ) : (
                <UserTable
                    users={users}
                    reload={loadData}
                    setEditUser={setEditUser}
                />
            )}

            {showAdd && (
                <AddUserModal
                    onClose={() => setShowAdd(false)}
                    reload={loadData}
                />
            )}

            {editUser && (
                <EditUserModal
                    user={editUser}
                    onClose={() => setEditUser(null)}
                    reload={loadData}
                />
            )}
        </div>
    );
}
