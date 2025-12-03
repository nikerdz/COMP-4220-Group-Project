import { useState } from "react";
import { API_BASE } from "../../api";

interface User {
    UserID: number;
    UserName: string;
    FullName: string | null;
    Email: string | null;
    Type: string;
    Manager: boolean;
}

interface UserEditModalProps {
    user: User;
    onClose: () => void;
    reload: () => void;
}

export default function UserEditModal({ user, onClose, reload }: UserEditModalProps) {
    const [form, setForm] = useState({
        UserID: user.UserID,
        UserName: user.UserName,
        FullName: user.FullName ?? "",
        Email: user.Email ?? "",
        Type: user.Type,
        Manager: user.Manager
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;

        if (type === "checkbox") {
            const checkbox = e.target as HTMLInputElement;
            setForm(prev => ({ ...prev, [name]: checkbox.checked }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSave = async () => {
        const payload = {
            UserID: form.UserID,
            UserName: form.UserName,
            FullName: form.FullName || null,
            Email: form.Email || null,
            Type: form.Type,
            Manager: form.Manager
        };

        const res = await fetch(`${API_BASE}/api/admin/users/${form.UserID}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const msg = await res.text();
            alert("Failed to update user: " + msg);
            return;
        }

        reload();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
            <div className="bg-white p-6 w-96 rounded shadow">

                <h2 className="text-xl font-bold mb-4">Edit User</h2>

                <input
                    className="input mb-2 w-full"
                    name="UserName"
                    value={form.UserName}
                    onChange={handleChange}
                    placeholder="Username"
                />

                <input
                    className="input mb-2 w-full"
                    name="FullName"
                    value={form.FullName}
                    onChange={handleChange}
                    placeholder="Full Name"
                />

                <input
                    className="input mb-2 w-full"
                    name="Email"
                    value={form.Email}
                    onChange={handleChange}
                    placeholder="Email"
                />

                <label className="flex items-center gap-2 mb-4">
                    <input
                        type="checkbox"
                        name="Manager"
                        checked={form.Manager}
                        onChange={handleChange}
                    />
                    <span>Manager Access</span>
                </label>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 rounded"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                        Save
                    </button>
                </div>

            </div>
        </div>
    );
}
