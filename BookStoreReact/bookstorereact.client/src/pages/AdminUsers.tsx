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
        <div className="p-2">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Users</h1>

                <button
                    onClick={() => setShowAdd(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    + Add User
                </button>
            </div>

            {/* Scrollable table wrapper */}
            <div className="max-h-[600px] overflow-y-auto bg-white border rounded shadow">
                {loading ? (
                    <p className="p-4">Loading users...</p>
                ) : (
                    <UserTable
                        users={users}
                        reload={loadData}
                        setEditUser={setEditUser}
                    />
                )}
            </div>

            {/* Add Modal */}
            {showAdd && (
                <AddUserModal
                    onClose={() => setShowAdd(false)}
                    reload={loadData}
                />
            )}

            {/* Edit Modal */}
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
