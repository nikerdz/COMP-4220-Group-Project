import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
            <h1 className="text-4xl font-bold mb-2 text-slate-800">404</h1>
            <p className="text-lg text-slate-600 mb-6">
                Sorry, that page doesn&apos;t exist.
            </p>

            <div className="flex gap-3">
                <Link
                    to="/"
                    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                    Go to Home
                </Link>
                <Link
                    to="/profile"
                    className="px-4 py-2 rounded border border-slate-300 text-slate-700 hover:bg-slate-100"
                >
                    Go to Profile
                </Link>
            </div>
        </div>
    );
}
