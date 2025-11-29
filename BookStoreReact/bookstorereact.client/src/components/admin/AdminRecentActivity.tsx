export default function AdminRecentActivity() {
    const mock: string[] = [
        "User JohnDoe placed an order.",
        "Admin added a new book.",
        "Supplier list updated.",
        "3 coupons are expiring soon.",
    ];

    return (
        <div className="bg-white shadow-md border border-gray-200 rounded-xl p-6 mt-10">
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            <ul className="list-disc ml-5 space-y-2 text-gray-700">
                {mock.map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                ))}
            </ul>
        </div>
    );
}
