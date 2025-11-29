import { useState } from "react";
import { API_BASE } from "../../api";
import type { User } from "../../User";

interface UserEditModalProps {
    user: User;
    onClose: () => void;
    reload: () => void;
}

interface EditForm {
    fullName: string | null;
    email: string | null;
    type: "CU" | "AD";
    manager: boolean;
}

export default function UserEditModal({ user, onClose, reload }: UserEditModalProps) {

    const [form, setForm] = useState<EditForm>({
        fullName: user.fullName,
        email: user.email,
        type: user.type,
        manager: user.manager,
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;

        const updatedValue =
            type === "checkbox"
                ? (e.target as HTMLInputElement).checked
                : value;

        setForm(prev => ({
            ...prev,
            [name]: updatedValue
        }));
    };

    const handleSave = async () => {
        await fetch(`${API_BASE}/api/admin/users/${user.userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(form),
        });

        reload();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
            <div className="bg-white p-6 w-96 rounded shadow">
                <h2 className="text-xl font-bold mb-4">Edit User</h2>

                <p className="text-sm mb-2 text-gray-500">Username: {user.userName}</p>

                <input
                    name="fullName"
                    className="input mb-2 w-full"
                    value={form.fullName ?? ""}
                    onChange={handleChange}
                    placeholder="Full Name"
                />

                <input
                    name="email"
                    className="input mb-2 w-full"
                    value={form.email ?? ""}
                    onChange={handleChange}
                    placeholder="Email"
                />

                <select
                    name="type"
                    className="input mb-2 w-full"
                    value={form.type}
                    onChange={handleChange}
                >
                    <option value="CU">Customer</option>
                    <option value="AD">Admin</option>
                </select>

                <label className="flex items-center gap-2 mb-4">
                    <input
                        type="checkbox"
                        name="manager"
                        checked={form.manager}
                        onChange={handleChange}
                    />
                    <span>Manager</span>
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
                        Update
                    </button>
                </div>
            </div>
        </div>
    );
}
