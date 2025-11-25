import { Link } from "react-router-dom";

type ButtonProps = {
    to?: string;           
    onClick?: () => void;   
    children: React.ReactNode;
    color?: "blue" | "green" | "gray";
};

export default function Button({ to, onClick, children, color = "blue" }: ButtonProps) {
    const base =
        "px-4 py-2 rounded-lg font-medium transition text-white focus:outline-none focus:ring-2 focus:ring-offset-2";
    const colorMap = {
        blue: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
        green: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
        gray: "bg-gray-600 hover:bg-gray-700 focus:ring-gray-500",
    };

    const className = `${base} ${colorMap[color]}`;

    if (to) {
        return (
            <Link to={to} className={className}>
                {children}
            </Link>
        );
    }

    return (
        <button onClick={onClick} className={className}>
            {children}
        </button>
    );
}
