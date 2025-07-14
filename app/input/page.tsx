'use client';
import { useEffect, useState, useRef } from "react";
import { FiSend } from "react-icons/fi";
import Sidebar from "../components/Sidebar";

type Message = { role: "user" | "assistant"; content: string };
const TakeInput = () => {

    const textAreaRef = useRef<HTMLTextAreaElement>(null)

    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [showEmptyChat, setShowEmptyChat] = useState(true);
    const [conversation, setConversation] = useState<Message[]>([]);
    const [errorMessage, setErrorMessage] = useState("");
    const bottomOfChatRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = "24px";
            textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
        }
        if (bottomOfChatRef.current) {
            bottomOfChatRef.current.scrollIntoView({ behavior: "smooth" });
        }

    }, [textAreaRef, bottomOfChatRef]);
    const askGroq = async () => {
        setLoading(true);
        try {
            const convo: Message[] = [
                ...conversation,
                { role: "user", content: input }
            ];
            setConversation(convo);
            setInput("");
            setShowEmptyChat(false);
            const res = await fetch("/api/ask", {
                method: "POST",
                body: JSON.stringify({ prompt: input }),
                headers: { "Content-Type": "application/json" },
            });

            const data = await res.json();
            setConversation(prev => [
                ...prev,
                { role: "assistant", content: data.response || data.error }
            ]);

        } catch (error) {
            setErrorMessage("Error: Could not get response from AI");
            console.error("Error asking Groq:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleKeypress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            if (input.trim().length > 0 && !loading) {
                askGroq();
            }
            e.preventDefault();
        }
    };

    return (
        <div className="min-h-screen bg-black flex max-w-full flex-1 flex-row">
            <div className="w-64 bg-gray-900 border-r border-white/20 hidden md:block min-h-screen sticky top-0">
                <Sidebar />
            </div>
            <div className="flex-1 flex flex-col">
                <div className="relative w-full transition-width flex flex-col items-stretch flex-1">
                    <div className="flex-1">
                        <div className="react-scroll-to-bottom--css-ikyem-79elbk dark:bg-black">
                            <div className="react-scroll-to-bottom--css-ikyem-1n7m0yu">
                                {!showEmptyChat && conversation.length > 0 ? (
                                    <div className="max-w-7xl flex flex-col items-center text-sm bg-black mt-10 px-4">
                                        {conversation.map((msg, idx) => (
                                            <div
                                                key={idx}
                                                className={`flex w-full mb-2 ${msg.role === "user" ? "justify-end" : "justify-start pl-20"}`}
                                                style={{ justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}
                                            >
                                                <div
                                                    className={`max-w-[60%] p-3 rounded-xl text-sm whitespace-pre-wrap break-words shadow-lg
                                                        ${msg.role === "user"
                                                            ? "bg-blue-500 text-white rounded-br-none"
                                                            : "bg-gray-200 dark:bg-[#444654] text-gray-900 dark:text-gray-100 rounded-bl-none font-mono border border-gray-300 dark:border-gray-600"}
                                                    `}
                                                    style={{
                                                        marginRight: msg.role === "user" ? "2.5rem" : "auto",
                                                        marginLeft: msg.role === "assistant" ? "2.5rem" : "auto"
                                                    }}
                                                >
                                                    {msg.content}
                                                </div>
                                            </div>
                                        ))}
                                        <div className="w-full h-32 md:h-48 flex-shrink-0"></div>
                                        <div ref={bottomOfChatRef}></div>
                                    </div>
                                ) : null}
                                {showEmptyChat ? (
                                    <div className="py-10 relative w-full flex flex-col h-full">
                                        <h1 className="text-2xl sm:text-4xl font-semibold text-center text-gray-200 dark:text-gray-600 flex gap-2 items-center justify-center h-screen">
                                            QAI
                                        </h1>
                                    </div>
                                ) : null}
                                <div className="flex flex-col items-center text-sm dark:bg-gray-800"></div>
                            </div>
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full border-t md:border-t-0 dark:border-white/20 md:border-transparent md:dark:border-transparent md:bg-vert-light-gradient bg-white dark:bg-gray-800 md:!bg-transparent dark:md:bg-vert-dark-gradient pt-2">
                        <form className="stretch mx-2 flex flex-row gap-3 last:mb-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
                            <div className="relative flex flex-col h-full flex-1 items-stretch md:flex-col">
                                {errorMessage ? (
                                    <div className="mb-2 md:mb-0">
                                        <div className="h-full flex ml-1 md:w-full md:m-auto md:mb-2 gap-0 md:gap-2 justify-center">
                                            <span className="text-red-500 text-sm">{errorMessage}</span>
                                        </div>
                                    </div>
                                ) : null}
                                <div className="flex flex-col w-full py-2 flex-grow md:py-3 md:pl-4 relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]">
                                    <textarea
                                        ref={textAreaRef}
                                        value={input}
                                        tabIndex={0}
                                        data-id="root"
                                        style={{
                                            height: "24px",
                                            maxHeight: "200px",
                                            overflowY: "hidden",
                                        }}
                                        rows={1}
                                        placeholder="Send a message..."
                                        className="m-0 w-full resize-none border-0 bg-transparent p-0 pr-7 focus:ring-0 focus-visible:ring-0 dark:bg-transparent pl-2 md:pl-0"
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={handleKeypress}
                                    ></textarea>
                                    <button
                                        disabled={loading || input?.length === 0}
                                        onClick={e => { e.preventDefault(); if (input.trim().length > 0 && !loading) askGroq(); }}
                                        className="absolute p-1 rounded-md bottom-1.5 md:bottom-2.5 bg-transparent disabled:bg-gray-500 right-1 md:right-2 disabled:opacity-40"
                                    >
                                        <FiSend className="h-4 w-4 mr-1 text-white " />
                                    </button>
                                </div>
                            </div>
                        </form>
                        <div className="px-3 pt-2 pb-3 text-center text-xs text-black/50 dark:text-white/50 md:px-4 md:pt-3 md:pb-6">
                            <span>
                                QAI answers your queries based on the input provided.
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TakeInput;
