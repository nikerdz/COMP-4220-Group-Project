import { useState } from "react";
import { API_BASE } from "../../api";

interface UserAddModalProps {
    onClose: () => void;
    reload: () => void;
}

export default function UserAddModal({ onClose, reload }: UserAddModalProps) {
    const [form, setForm] = useState({
        UserName: "",
        FullName: "",
        Email: "",
        Type: "AD",     // admin only
        Manager: false,
        Password: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === "checkbox") {
            const checkbox = e.target as HTMLInputElement;
            setForm(prev => ({ ...prev, [name]: checkbox.checked }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSave = async () => {
        if (!form.UserName.trim()) return alert("Username is required.");
        if (!form.Password.trim()) return alert("Password is required.");

        const payload = {
            UserName: form.UserName,
            FullName: form.FullName || null,
            Email: form.Email || null,
            Type: "AD",
            Manager: form.Manager,
            Password: form.Password
        };

        const res = await fetch(`${API_BASE}/api/admin/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            alert("Failed to add user");
            return;
        }

        reload();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
            <div className="bg-white p-6 w-96 rounded shadow">

                <h2 className="text-xl font-bold mb-4">Add Admin User</h2>

                <input
                    className="input mb-2 w-full"
                    name="UserName"
                    placeholder="Username"
                    value={form.UserName}
                    onChange={handleChange}
                />

                <input
                    className="input mb-2 w-full"
                    name="FullName"
                    placeholder="Full Name"
                    value={form.FullName}
                    onChange={handleChange}
                />

                <input
                    className="input mb-2 w-full"
                    name="Email"
                    placeholder="Email"
                    value={form.Email}
                    onChange={handleChange}
                />

                <input
                    className="input mb-2 w-full"
                    name="Password"
                    type="password"
                    placeholder="Password"
                    value={form.Password}
                    onChange={handleChange}
                />

                <label className="flex items-center gap-2 mb-2">
                    <input
                        type="checkbox"
                        name="Manager"
                        checked={form.Manager}
                        onChange={handleChange}
                    />
                    <span>Manager Access</span>
                </label>

                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded">
                        Save
                    </button>
                </div>

            </div>
        </div>
    );
}
