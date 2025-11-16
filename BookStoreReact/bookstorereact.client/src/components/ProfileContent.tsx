type Section = "info" | "orders" | "wishlist";

interface ProfileContentProps {
    activeSection: Section;
}

export default function ProfileContent({ activeSection }: ProfileContentProps) {
    if (activeSection === "info") {
        return (
            <div>
                <h2 className="text-xl font-semibold text-black mb-2">
                    General Info
                </h2>
                <p className="text-sm text-black">
                    User details (name, email, address etc) will go here.
                </p>
            </div>
        );
    }

    if (activeSection === "orders") {
        return (
            <div>
                <h2 className="text-xl font-semibold text-black mb-2">
                    Order History
                </h2>
                <p className="text-sm text-black">
                    A list of past orders will be shown here.
                </p>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-xl font-semibold text-black mb-2">
                Wishlist
            </h2>
            <p className="text-sm text-black">
                Wishlist items will appear here.
            </p>
        </div>
    );
}
