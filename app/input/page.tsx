'use client';
import { useState } from "react";



const TakeInput = () => {
    const [input, setInput] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);

    const askGroq = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/ask", {
                method: "POST",
                body: JSON.stringify({ prompt: input }),
                headers: { "Content-Type": "application/json" },
            });

            const data = await res.json();
            setResponse(data.response || data.error);
        } catch (error) {
            setResponse("Error: Could not get response from AI");
            console.error("Error asking Groq:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="max-w-7xl mx-auto px-4 py-16">
            <div className="flex flex-col items-center space-y-8">
                <h2 className="text-white text-3xl md:text-4xl font-bold text-center mb-8">
                    Ask AI Anything
                </h2>
                <div className="w-full max-w-4xl relative">
                    <div className="relative">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask your question here..."
                            className="w-full p-6 bg-gray-900/50 border border-gray-700/50 rounded-2xl text-white placeholder-gray-400 resize-none focus:outline-none focus:border-gray-500/50 focus:bg-gray-800/50 transition-all duration-300"
                            rows={4}
                        />
                        <button
                            onClick={askGroq}
                            disabled={!input.trim() || loading}
                            className="absolute bottom-4 right-4 text-white px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 rounded-full shadow-lg hover:shadow-gray-700/60 transition-all duration-300 border border-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    <span>Thinking...</span>
                                </>
                            ) : (
                                "Ask AI"
                            )}
                        </button>
                    </div>
                </div>
                {response && (
                    <div className="w-full max-w-4xl">
                        <div className="bg-gray-900/30 border border-gray-700/30 rounded-2xl p-6 backdrop-blur-sm">
                            <h3 className="text-white text-lg font-semibold mb-4">AI Response:</h3>
                            <div className="text-gray-200 whitespace-pre-wrap leading-relaxed">
                                {response}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}

export default TakeInput;