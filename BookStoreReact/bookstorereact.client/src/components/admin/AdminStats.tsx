type StatItem = {
    label: string;
    value: string | number;
    color?: string; // optional styling if you add it later
};

interface AdminStatsProps {
    stats: StatItem[];
}

export default function AdminStats({ stats }: AdminStatsProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.map((stat: StatItem, index: number) => (
                <div
                    key={index}
                    className="bg-white shadow-md rounded-xl p-6 border border-gray-200 flex flex-col"
                >
                    <p className="text-gray-500 text-sm">{stat.label}</p>
                    <p className="text-3xl font-bold mt-2 text-gray-800">{stat.value}</p>
                </div>
            ))}
        </div>
    );
}
