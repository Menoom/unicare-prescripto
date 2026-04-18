import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const initialMessages = [
    { sender: 'bot', text: 'Hi! I am your medical assistant. How can I help you today?' }
];

const Chatbot = ({ backendUrl, onAction }) => {
    const [messages, setMessages] = useState(initialMessages);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false); // collapsed by default
    const chatEndRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return; // don't scroll if panel is closed
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        const userMsg = { sender: 'user', text: input };
        setMessages((msgs) => [...msgs, userMsg]);
        setInput('');
        setLoading(true);
        try {
            const { data } = await axios.post(`${backendUrl}/api/chat`, { message: input });
            if (data.success) {
                setMessages((msgs) => [...msgs, { sender: 'bot', text: data.response_text, data }]);
                // UI actions
                if (onAction) onAction(data);
            } else {
                setMessages((msgs) => [...msgs, { sender: 'bot', text: data.response_text || 'Sorry, something went wrong.' }]);
            }
        } catch (err) {
            const errorMessage = err.response?.data?.response_text
                || err.response?.data?.message
                || (backendUrl ? `Unable to reach chatbot service at ${backendUrl}.` : 'Backend URL is not configured.');

            setMessages((msgs) => [...msgs, { sender: 'bot', text: errorMessage }]);
        }
        setLoading(false);
    };

    // Render extra UI for doctors/slots if present
    const renderExtras = (msg) => {
        if (!msg.data) return null;
        const { intent, doctors, slots, speciality } = msg.data;
        if (intent === 'symptom_check' && doctors?.length) {
            return (
                <div className="mt-2 text-xs">
                    <b>Doctors for {speciality}:</b>
                    <ul className="list-disc ml-4">
                        {doctors.map((doc) => (
                            <li key={doc._id}>{doc.name} ({doc.speciality})</li>
                        ))}
                    </ul>
                </div>
            );
        }
        if (intent === 'booking' && doctors?.length && slots?.length) {
            return (
                <div className="mt-2 text-xs">
                    <b>Available slots for {doctors[0].name}:</b>
                    <ul className="list-disc ml-4">
                        {slots.map((slot, i) => (
                            <li key={i}>{slot.time} ({slot.isBooked ? 'Booked' : 'Available'})</li>
                        ))}
                    </ul>
                </div>
            );
        }
        return null;
    };

    return (
        <>
            {/* Floating toggle when closed */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 z-50 bg-primary text-white px-4 py-3 rounded-full shadow-lg font-semibold"
                    title="Open chat"
                >
                    Chat
                </button>
            )}

            {isOpen && (
                <div className="fixed bottom-6 right-6 z-50 w-80 max-w-full bg-white border rounded-lg shadow-lg flex flex-col h-[520px]">
                    <div className="bg-primary text-white px-4 py-2 rounded-t-lg font-semibold flex items-center justify-between">
                        <span>AI Medical Assistant</span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-sm px-2 py-1 bg-primary/20 hover:bg-primary/30 rounded"
                                title="Minimize"
                            >
                                Minimize
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-sm px-2 py-1 bg-primary/20 hover:bg-primary/30 rounded"
                                title="Close"
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    {/* messages area: fixed height via parent, scrollable */}
                    <div className="flex-1 overflow-y-auto p-3">
                        {messages.map((msg, i) => (
                            <div key={i} className={`mb-2 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`px-3 py-2 rounded-lg max-w-[80%] whitespace-pre-wrap break-words ${msg.sender === 'user' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800'}`}>
                                    {msg.text}
                                    {msg.sender === 'bot' && renderExtras(msg)}
                                </div>
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>

                    <form onSubmit={sendMessage} className="flex border-t">
                        <input
                            className="flex-1 px-3 py-2 outline-none"
                            type="text"
                            placeholder="Type your message..."
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            disabled={loading}
                        />
                        <button className="px-4 py-2 bg-primary text-white rounded-r-lg" type="submit" disabled={loading || !input.trim()}>
                            {loading ? '...' : 'Send'}
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};

export default Chatbot;
