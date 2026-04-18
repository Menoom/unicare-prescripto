import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

// Keep this list short (5-6) like help-bots; user can still type custom symptoms.
const SYMPTOM_OPTIONS = [
    'Fever / Cold / Cough',
    'Stomach / Digestion',
    'Skin / Allergy',
    'Headache / Migraine',
    'Chest / Heart / Breathing',
    'Back / Joint / Bone',
    'Other (type it)'
];

const initialMessages = [
    {
        sender: 'bot',
        text: 'Hi! I am your medical assistant. How can I help you today?',
        options: [
            { label: 'Check Symptoms', value: 'Check Symptoms' },
            { label: 'Book Appointment', value: 'Book Appointment' },
            { label: 'View My Appointments', value: 'View My Appointments' },
            { label: 'Find a Specialist', value: 'Find a Specialist' },
            { label: 'General Inquiry', value: 'General Inquiry' }
        ]
    }
];

const Chatbot = ({ backendUrl, onAction }) => {
    const [messages, setMessages] = useState(initialMessages);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false); // collapsed by default
    const [flow, setFlow] = useState({ mode: 'menu', waitingForSymptom: false, chatMode: 'guided', lastDoctorCards: null });
    const chatEndRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return; // don't scroll if panel is closed
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    const buildMenuOptions = () => ([
        { label: 'Check Symptoms', value: 'Check Symptoms' },
        { label: 'Book Appointment', value: 'Book Appointment' },
        { label: 'View My Appointments', value: 'View My Appointments' },
        { label: 'Find a Specialist', value: 'Find a Specialist' },
        { label: 'General Inquiry', value: 'General Inquiry' }
    ]);

    const resetToMenu = () => {
        setFlow((f) => ({ ...f, mode: 'menu', waitingForSymptom: false, chatMode: 'guided', lastDoctorCards: null }));
        setMessages((msgs) => [...msgs, {
            sender: 'bot',
            text: 'What would you like to do next?',
            options: buildMenuOptions()
        }]);
    };

    const askSymptom = () => {
        setFlow({ mode: 'symptom', waitingForSymptom: true });
        setMessages((msgs) => [...msgs, {
            sender: 'bot',
            text: 'Which symptom best matches your issue? You can also type it in the box below.',
            options: SYMPTOM_OPTIONS.map((s) => ({ label: s, value: s }))
        }]);
    };

    const callBackend = async (messageText, { followUp = 'menu' } = {}) => {
        setLoading(true);
        try {
            const userId = localStorage.getItem('userId');
            const { data } = await axios.post(`${backendUrl}/api/chat`, { message: messageText, userId });
            if (data.success) {
                setMessages((msgs) => [...msgs, { sender: 'bot', text: data.response_text, data }]);
                if (onAction) onAction(data);

                // In free-chat mode, don't force the menu after every response.
                if (flow.chatMode !== 'free') {
                    if (followUp === 'symptom_actions') {
                        const cards = data.doctor_cards?.slice?.(0, 2) || [];
                        setFlow((f) => ({ ...f, lastDoctorCards: cards }));
                        setMessages((msgs) => [...msgs, {
                            sender: 'bot',
                            text: 'What would you like to do?',
                            options: [
                                { label: 'Show me the doctors', value: 'Show me the doctors' },
                                { label: 'Go back', value: 'Go back' }
                            ]
                        }]);
                    } else {
                        resetToMenu();
                    }
                }
                return;
            }
            setMessages((msgs) => [...msgs, { sender: 'bot', text: data.response_text || 'Sorry, something went wrong.' }]);
            if (flow.chatMode !== 'free') resetToMenu();
        } catch (err) {
            const errorMessage = err.response?.data?.response_text
                || err.response?.data?.message
                || (backendUrl ? `Unable to reach chatbot service at ${backendUrl}.` : 'Backend URL is not configured.');
            setMessages((msgs) => [...msgs, { sender: 'bot', text: errorMessage }]);
            if (flow.chatMode !== 'free') resetToMenu();
        } finally {
            setLoading(false);
        }
    };

    const handleOptionSelect = async (optionValue) => {
        // Always echo the exact selected text by showing it as the user's answer.
        const userMsg = { sender: 'user', text: optionValue };
        setMessages((msgs) => [...msgs, userMsg]);

        if (optionValue === 'Go back') {
            resetToMenu();
            return;
        }

        if (optionValue === 'Show me the doctors') {
            const cards = flow.lastDoctorCards || [];
            if (!cards.length) {
                setMessages((msgs) => [...msgs, {
                    sender: 'bot',
                    text: 'I do not have any doctor suggestions yet. Please check symptoms first, or type your issue.'
                }]);
                resetToMenu();
                return;
            }

            setMessages((msgs) => [...msgs, {
                sender: 'bot',
                text: 'Here are a couple of doctors you can consult:',
                data: { doctor_cards: cards }
            }]);
            resetToMenu();
            return;
        }

        // Local questionnaire routing first.
        if (optionValue === 'Start Over') {
            setMessages(initialMessages);
            setFlow({ mode: 'menu', waitingForSymptom: false });
            return;
        }

        if (optionValue === 'Check Symptoms') {
            setFlow((f) => ({ ...f, chatMode: 'guided' }));
            askSymptom();
            return;
        }

        if (optionValue === 'General Inquiry') {
            setFlow((f) => ({ ...f, chatMode: 'free', waitingForSymptom: false, mode: 'general' }));
            setMessages((msgs) => [...msgs, {
                sender: 'bot',
                text: "Sure — ask me anything about booking, payments, doctors, or how the app works."
            }]);
            return;
        }

        if (flow.waitingForSymptom) {
            // Selected a symptom option
            if (optionValue === 'Other (type it)') {
                setMessages((msgs) => [...msgs, {
                    sender: 'bot',
                    text: 'Please type your symptom/problem in the box below, then press Send.'
                }]);
                return;
            }
            setFlow((f) => ({ ...f, mode: 'symptom', waitingForSymptom: false }));
            await callBackend(`I have ${optionValue}`, { followUp: 'symptom_actions' });
            return;
        }

        // Fallback: send selected option text to backend.
        await callBackend(optionValue);
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        const typed = input;
        setInput('');

        // If we're waiting for symptom and user typed, treat it as symptom detail.
        if (flow.waitingForSymptom) {
            setMessages((msgs) => [...msgs, { sender: 'user', text: typed }]);
            setFlow((f) => ({ ...f, mode: 'symptom', waitingForSymptom: false, chatMode: 'guided' }));
            await callBackend(`I have ${typed}`, { followUp: 'symptom_actions' });
            return;
        }

        // In free-chat mode, typed text should be treated like a normal chat.
        if (flow.chatMode === 'free') {
            setMessages((msgs) => [...msgs, { sender: 'user', text: typed }]);
            await callBackend(typed);
            return;
        }

        await handleOptionSelect(typed);
    };

    const renderDoctorCards = (msg) => {
        const cards = msg.data?.doctor_cards?.slice?.(0, 2);
        if (!cards?.length) return null;

        return (
            <div className="mt-2 grid grid-cols-1 gap-2">
                {cards.map((doc) => (
                    <div key={doc._id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg border border-gray-100">
                        <img src={doc.image} alt={doc.name} className="w-10 h-10 rounded-full object-cover bg-white" />
                        <div className="min-w-0">
                            <div className="font-semibold text-[11px] text-gray-800 truncate">{doc.name}</div>
                            <div className="text-[10px] text-gray-600 truncate">{doc.designation}</div>
                            {doc.experience && (
                                <div className="text-[10px] text-gray-500">{doc.experience} experience</div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderAppointmentCards = (msg) => {
        const cards = msg.data?.appointment_cards;
        if (!cards?.length) return null;

        return (
            <div className="mt-2 grid grid-cols-1 gap-2">
                {cards.map((apt) => (
                    <div key={apt._id} className="p-2 bg-white rounded-lg border border-gray-100">
                        <div className="flex items-center gap-3">
                            {apt.doctor?.image && (
                                <img src={apt.doctor.image} alt={apt.doctor.name || 'Doctor'} className="w-9 h-9 rounded-full object-cover" />
                            )}
                            <div className="min-w-0 flex-1">
                                <div className="font-semibold text-[11px] text-gray-800 truncate">{apt.doctor?.name || 'Doctor'}</div>
                                <div className="text-[10px] text-gray-600 truncate">{apt.doctor?.designation}</div>
                                <div className="text-[10px] text-gray-500">{apt.slotDate} • {apt.slotTime}</div>
                                {apt.cancelled ? (
                                    <div className="text-[10px] text-red-500">Cancelled</div>
                                ) : apt.isCompleted ? (
                                    <div className="text-[10px] text-green-600">Completed</div>
                                ) : (
                                    <div className="text-[10px] text-blue-600">Upcoming</div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    // Render extra UI for doctors/slots if present (legacy + new card payloads)
    const renderExtras = (msg) => {
        const cardDoctors = renderDoctorCards(msg);
        if (cardDoctors) return cardDoctors;

        const cardAppointments = renderAppointmentCards(msg);
        if (cardAppointments) return cardAppointments;

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
                    className="fixed bottom-6 right-6 z-50 bg-primary text-white p-4 rounded-full shadow-xl hover:scale-105 transition-transform flex items-center justify-center"
                    title="Open UniBot"
                >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 8V4H8"></path><rect width="16" height="12" x="4" y="8" rx="2"></rect><path d="M2 14h2"></path><path d="M20 14h2"></path><path d="M15 13v2"></path><path d="M9 13v2"></path>
                    </svg>
                </button>
            )}

            {isOpen && (
                <div className="fixed bottom-6 right-6 z-50 w-80 max-w-full bg-white border rounded-xl shadow-2xl flex flex-col h-[520px] overflow-hidden">
                    <div className="bg-primary text-white px-4 py-3 font-semibold flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-2">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 8V4H8"></path><rect width="16" height="12" x="4" y="8" rx="2"></rect><path d="M2 14h2"></path><path d="M20 14h2"></path><path d="M15 13v2"></path><path d="M9 13v2"></path>
                            </svg>
                            <span>UniBot</span>
                        </div>
                        <div className="flex items-center gap-2">
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
                    <div className="flex-1 overflow-y-auto p-3 text-xs bg-gray-50/50">
                        {messages.map((msg, i) => (
                            <div key={i} className={`mb-4 flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`px-3 py-2.5 rounded-2xl max-w-[85%] whitespace-pre-wrap break-words shadow-sm ${msg.sender === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'}`}>
                                    {msg.text}
                                    {msg.sender === 'bot' && renderExtras(msg)}
                                </div>
                                {msg.sender === 'bot' && msg.options && (
                                    <div className="flex flex-col w-full max-w-[85%] mt-2 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                        {msg.options.map((opt, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleOptionSelect(opt.value)}
                                                disabled={loading}
                                                className="text-left text-[11px] px-3 py-2.5 text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors disabled:opacity-50 border-b border-gray-100 last:border-b-0 break-words"
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>

                    <form onSubmit={sendMessage} className="flex border-t bg-white">
                        <input
                            className="flex-1 px-3 py-2.5 outline-none text-xs"
                            type="text"
                            placeholder={flow.chatMode === 'free' ? 'Ask a question…' : (flow.waitingForSymptom ? 'Type your symptom…' : 'Type a message…')}
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            disabled={loading}
                        />
                        <button className="px-4 py-2.5 bg-primary text-white text-xs font-medium" type="submit" disabled={loading || !input.trim()}>
                            {loading ? '...' : 'Send'}
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};

export default Chatbot;
