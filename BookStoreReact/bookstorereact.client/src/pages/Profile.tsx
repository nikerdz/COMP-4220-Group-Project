"use client";

import { useState } from "react";
import ProfileContent from "../components/ProfileContent";

type Section = "info" | "orders" | "wishlist";

export default function Profile() {
    const [activeSection, setActiveSection] = useState<Section>("info");

    return (
        <div className="min-h-screen flex items-center px-16 py-10">
            {/* left side bar */}
            <aside className="w-48 flex flex-col justify-center">
                <h1 className="text-2xl font-bold text-black mb-8">
                    Profile
                </h1>

                <nav className="space-y-2">
                    <SidebarButton
                        label="General Info"
                        isActive={activeSection === "info"}
                        onClick={() => setActiveSection("info")}
                    />
                    <SidebarButton
                        label="Order History"
                        isActive={activeSection === "orders"}
                        onClick={() => setActiveSection("orders")}
                    />
                    <SidebarButton
                        label="Wishlist"
                        isActive={activeSection === "wishlist"}
                        onClick={() => setActiveSection("wishlist")}
                    />
                </nav>
            </aside>

            {/* middle content */}
            <div className="h-64 border-l mx-8" />
            <main className="flex-1 flex justify-center">
                <div className="max-w-xl w-full">
                    <ProfileContent activeSection={activeSection} />
                </div>
            </main>
        </div>
    );
}

type SidebarButtonProps = {
    label: string;
    isActive: boolean;
    onClick: () => void;
};

function SidebarButton({ label, isActive, onClick }: SidebarButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`block w-full text-left py-1 text-sm ${isActive ? "font-semibold underline" : "font-normal hover:underline"
                } text-black`}
        >
            {label}
        </button>
    );
}
