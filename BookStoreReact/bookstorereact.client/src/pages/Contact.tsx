import { useState } from "react";

const fakeReviews = [
    `“Fast shipping and great selection!” — Liam`,
    `“Found every book I needed for class.” — Ava`,
    `“Customer support was super helpful.” — Noah`,
    `“Easy to use and nicely designed.” — Sophia`,
    `“My go-to bookstore now.” — Ethan`,
];

export default function Contact() {
    // Form state
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [rating, setRating] = useState(5);
    const [message, setMessage] = useState("");
    const [sent, setSent] = useState<null | { ts: number }>(null);

    // Simulated submit handler
    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSent({ ts: Date.now() });
        setName("");
        setEmail("");
        setRating(5);
        setMessage("");
        setTimeout(() => setSent(null), 4000);
    }
    // Fake contact & review form that doesn't actually submit anywhere
    // and just renders some reviews
    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <div className="w-full bg-slate-900 text-slate-100 border-b border-slate-800">
                <div className="overflow-hidden whitespace-nowrap py-2">
                    <div className="inline-flex gap-6 animate-marquee">
                        {fakeReviews.map((text, i) => (
                            <span
                                key={`r1-${i}`}
                                className="text-xs sm:text-sm px-3 py-1 rounded-full bg-slate-800/70 border border-slate-700"
                            >
                                {text}
                            </span>
                        ))}
                        {fakeReviews.map((text, i) => (
                            <span
                                key={`r2-${i}`}
                                className="text-xs sm:text-sm px-3 py-1 rounded-full bg-slate-800/70 border border-slate-700"
                            >
                                {text}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
            <main className="flex-1">
                <section className="w-full py-8">
                    <div className="px-4 sm:px-8 lg:px-16">
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">
                            Contact & Reviews
                        </h1>
                        <p className="text-sm sm:text-base text-slate-600 mb-6 max-w-2xl">
                            Have feedback, questions, or a quick review? Drop us a message
                            below.
                        </p>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4"
                            aria-label="Contact form"
                        >

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <label className="flex flex-col text-sm">
                                    <span className="text-slate-700 mb-1">Name</span>
                                    <input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white text-sm"
                                        placeholder="Your name"
                                    />
                                </label>

                                <label className="flex flex-col text-sm">
                                    <span className="text-slate-700 mb-1">Email</span>
                                    <input
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        type="email"
                                        className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white text-sm"
                                        placeholder="you@example.com"
                                    />
                                </label>
                            </div>

                            <div className="text-sm">
                                <span className="text-slate-700 mb-1 inline-block">
                                    Rating
                                </span>
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                    {[1, 2, 3, 4, 5].map((n) => (
                                        <button
                                            key={n}
                                            type="button"
                                            onClick={() => setRating(n)}
                                            className={`px-2 py-1 rounded-md text-xs sm:text-sm ${rating === n
                                                    ? "bg-yellow-300 text-slate-900"
                                                    : "bg-slate-100 text-slate-700"
                                                }`}
                                            aria-label={`Rate ${n} stars`}
                                        >
                                            {n}★
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <label className="flex flex-col text-sm">
                                <span className="text-slate-700 mb-1">Message / Review</span>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                    className="px-3 py-2 border rounded-md h-32 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white text-sm"
                                    placeholder="Tell us how your experience was or what you need help with."
                                />
                            </label>

                            <div className="flex flex-wrap items-center gap-3 mt-1">
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 text-sm"
                                >
                                    Send message
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setName("");
                                        setEmail("");
                                        setRating(5);
                                        setMessage("");
                                    }}
                                    className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100 text-sm"
                                >
                                    Clear
                                </button>

                                {sent && (
                                    <span className="ml-auto text-xs text-green-600">
                                        Message sent at{" "}
                                        {new Date(sent.ts).toLocaleTimeString()}
                                    </span>
                                )}
                            </div>
                        </form>
                    </div>
                </section>
            </main>
        </div>
    );
}
