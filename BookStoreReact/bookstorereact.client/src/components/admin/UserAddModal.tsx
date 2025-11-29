import { useState } from "react";
import { API_BASE } from "../../api";

interface UserAddModalProps {
    onClose: () => void;
    reload: () => void;
}

interface UserForm {
    userName: string;
    password: string;
    fullName: string;
    email: string;
    type: "CU" | "AD";
    manager: boolean;
}

export default function UserAddModal({ onClose, reload }: UserAddModalProps) {

    const [form, setForm] = useState<UserForm>({
        userName: "",
        password: "",
        fullName: "",
        email: "",
        type: "CU",
        manager: false
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, type, value } = e.target;
        const updatedValue = type === "checkbox"
            ? (e.target as HTMLInputElement).checked
            : value;

        setForm(prev => ({
            ...prev,
            [name]: updatedValue
        }));
    };

    const handleSave = async () => {
        if (!form.userName.trim() || !form.password.trim()) {
            alert("Username and password are required.");
            return;
        }

        const res = await fetch(`${API_BASE}/api/admin/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(form)
        });

        if (res.ok) {
            reload();
            onClose();
        } else {
            alert("Failed to add user.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
            <div className="bg-white p-6 w-96 rounded shadow">
                <h2 className="text-xl font-bold mb-4">Add User</h2>

                <input
                    name="userName"
                    className="input mb-2 w-full"
                    placeholder="Username"
                    onChange={handleChange}
                    value={form.userName}
                />

                <input
                    name="password"
                    className="input mb-2 w-full"
                    placeholder="Password"
                    type="password"
                    onChange={handleChange}
                    value={form.password}
                />

                <input
                    name="fullName"
                    className="input mb-2 w-full"
                    placeholder="Full Name"
                    onChange={handleChange}
                    value={form.fullName}
                />

                <input
                    name="email"
                    className="input mb-2 w-full"
                    placeholder="Email"
                    onChange={handleChange}
                    value={form.email}
                />

                <select
                    name="type"
                    className="input mb-2 w-full"
                    onChange={handleChange}
                    value={form.type}
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
                        className="px-4 py-2 bg-green-600 text-white rounded"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
