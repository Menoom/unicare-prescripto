/* eslint-disable react/prop-types */
import { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';

// ─── Constants ────────────────────────────────────────────────────────────────

const SYMPTOM_OPTIONS = [
    'Fever',
    'Headache',
    'Rash',
    'Stomach pain',
    'Other (type it)'
];

const URGENT_KEYWORDS = [
    'chest pain',
    'shortness of breath',
    'difficulty breathing',
    'breathing difficulty',
    'severe bleeding',
    'fainting',
    'passed out',
    'stroke',
    'face droop',
    'slurred speech',
    'seizure',
    'severe allergic reaction',
    'anaphylaxis',
    'suicidal',
    'kill myself'
];

const MENU_OPTIONS = [
    { label: 'Check Symptoms',       value: 'Check Symptoms' },
    { label: 'Book Appointment',     value: 'Book Appointment' },
    { label: 'View My Appointments', value: 'View My Appointments' },
    { label: 'Find a Specialist',    value: 'Find a Specialist' },
    { label: 'General Inquiry',      value: 'General Inquiry' },
    { label: 'Start Over',           value: 'Start Over' }
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const normalize = (text = '') => text.toLowerCase().replace(/\s+/g, ' ').trim();

const looksUrgent = (text = '') => {
    const t = normalize(text);
    return URGENT_KEYWORDS.some((k) => t.includes(k));
};

// ─── Response builders (pure functions, no side-effects) ─────────────────────

const buildSymptomJson = (symptomsText) => {
    const urgent = looksUrgent(symptomsText);
    return {
        intent: 'symptom_check',
        response: urgent
            ? 'Some symptoms you mentioned can be urgent. Please seek immediate medical attention now.'
            : "Symptoms can have many causes and I can't diagnose. Here's general guidance to help you decide when to see a doctor.",
        suggestions: urgent
            ? [
                'If you have chest pain, trouble breathing, severe bleeding, fainting, or severe allergic reaction — call emergency services or go to the nearest emergency department now.',
                'Have someone stay with you and avoid driving yourself.',
                'If symptoms worsen quickly, seek help immediately.'
            ]
            : [
                'Rest and stay hydrated.',
                'Monitor your symptoms and temperature.',
                'Avoid alcohol and get adequate sleep.',
                'Seek medical care if symptoms are severe, persistent, or you have concerning signs (e.g. trouble breathing, severe pain, dehydration).'
            ],
        follow_up_questions: urgent
            ? []
            : [
                'How long have you had these symptoms?',
                'Any red-flag signs like chest pain, trouble breathing, confusion, or severe pain?'
            ],
        urgency: urgent ? 'high' : 'low'
    };
};

const buildMoreTipsJson = (symptomsText) => {
    if (looksUrgent(symptomsText)) return buildSymptomJson(symptomsText);

    const t = normalize(symptomsText);

    if (t.includes('fever') || t.includes('cold') || t.includes('cough')) {
        return {
            intent: 'symptom_check',
            response: "For fever/cold-like symptoms, these general steps often help.",
            suggestions: [
                'Drink fluids and rest.',
                'Monitor temperature.',
                'Seek care if fever is high, lasts > 3 days, or you feel very unwell.'
            ],
            follow_up_questions: ["How long has it been going on, and what's your highest temperature (if measured)?"],
            urgency: 'low'
        };
    }
    if (t.includes('headache') || t.includes('migraine')) {
        return {
            intent: 'symptom_check',
            response: "Headaches can happen for many reasons (stress, dehydration, lack of sleep). Here are safe steps.",
            suggestions: [
                'Hydrate and rest in a quiet, dim room.',
                'Limit screen time for a bit.',
                'Seek urgent care if it\'s sudden/severe, with weakness, confusion, stiff neck, or vision changes.'
            ],
            follow_up_questions: ["Is this your worst headache ever, or similar to past headaches?"],
            urgency: 'low'
        };
    }
    if (t.includes('rash') || t.includes('itch')) {
        return {
            intent: 'symptom_check',
            response: "Rashes can be due to irritation or allergy. Here are general precautions.",
            suggestions: [
                'Avoid new products/foods you suspect might have triggered it.',
                'Keep the area clean and avoid scratching.',
                'Seek urgent care if there\'s facial swelling, breathing trouble, or widespread blistering.'
            ],
            follow_up_questions: ["When did it start, and is it spreading or associated with fever?"],
            urgency: 'low'
        };
    }
    if (t.includes('stomach') || t.includes('nausea') || t.includes('vomit') || t.includes('diarr')) {
        return {
            intent: 'symptom_check',
            response: "Stomach symptoms can have many causes. These general steps are usually safe.",
            suggestions: [
                'Sip fluids (ORS/electrolytes if available).',
                'Try light foods if tolerated.',
                'Seek care if there\'s severe pain, blood in stool/vomit, or signs of dehydration.'
            ],
            follow_up_questions: ["Any vomiting/diarrhea, and are you able to keep fluids down?"],
            urgency: 'low'
        };
    }
    if (t.includes('breath') || t.includes('chest')) {
        return {
            intent: 'symptom_check',
            response: "Breathing or chest discomfort can be serious. If it's severe or sudden, please seek medical care now.",
            suggestions: [
                'If you have severe chest pain or trouble breathing, get emergency help immediately.',
                'Avoid exertion until evaluated.'
            ],
            follow_up_questions: ["Is it severe, and are you short of breath at rest?"],
            urgency: 'medium'
        };
    }

    return {
        intent: 'symptom_check',
        response: "I can share general safety guidance and help you decide when to get checked.",
        suggestions: ['Rest, hydrate, and monitor your symptoms.'],
        follow_up_questions: ["How long has this been happening, and what are your top 2 symptoms?"],
        urgency: 'low'
    };
};

const buildGeneralJson = (userText) => {
    const urgent = looksUrgent(userText);
    return {
        intent: 'general_question',
        response: urgent
            ? 'If this is a medical emergency or you feel unsafe, please seek immediate help now. Urgent symptoms need in-person care.'
            : "I can help with general health guidance and appointment booking. What would you like to know?",
        suggestions: urgent
            ? ['Contact local emergency services or go to the nearest emergency department now.']
            : [],
        follow_up_questions: urgent
            ? []
            : ['Are you asking about symptoms, prevention/lifestyle, or booking an appointment?'],
        urgency: urgent ? 'high' : 'low'
    };
};

// ─── Initial state factory (function so it's never shared by reference) ──────

const makeInitialState = () => ({
    messages: [
        {
            id: Date.now(),
            sender: 'bot',
            payload: {
                intent: 'general_question',
                response: "Hi — I'm UniBot, your medical assistant. How can I help today?",
                suggestions: [],
                follow_up_questions: [],
                urgency: 'low'
            },
            options: MENU_OPTIONS,
            // tracks whether this message's options are still "live"
            optionsActive: true
        }
    ],
    flow: {
        mode: 'menu',           // 'menu' | 'symptom' | 'booking' | 'general'
        waitingForSymptom: false,
        chatMode: 'guided',     // 'guided' | 'free'
        lastSymptomText: '',
        bookingStep: null,      // null | 'ask_city' | 'show_doctors'
        bookingCity: ''
    }
});

// ─── Sub-components ───────────────────────────────────────────────────────────

const UrgencyBadge = ({ urgency }) => {
    if (!urgency || urgency === 'low') return null;
    const colors = {
        medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        high:   'bg-red-100 text-red-700 border-red-200'
    };
    return (
        <span className={`inline-flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.5 rounded-full border mt-1 ${colors[urgency]}`}>
            {urgency === 'high' ? '🚨 Urgent' : '⚠️ Moderate'}
        </span>
    );
};

const BotBubble = ({ payload, text }) => {
    // payload takes priority; text is the plain string fallback
    const content = payload?.response ?? text ?? '';
    const suggestions = payload?.suggestions ?? [];
    const questions   = payload?.follow_up_questions ?? [];
    const urgency     = payload?.urgency ?? 'low';

    return (
        <div className="px-3 py-2.5 rounded-2xl max-w-[85%] bg-white text-gray-800 border border-gray-100 rounded-bl-none shadow-sm text-xs">
            <p className="leading-relaxed">{content}</p>
            <UrgencyBadge urgency={urgency} />
            {suggestions.length > 0 && (
                <ul className="mt-2 space-y-1 list-disc ml-4 text-[11px] text-gray-600">
                    {suggestions.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
            )}
            {questions.length > 0 && (
                <p className="mt-2 text-[11px] text-gray-500 italic">{questions[0]}</p>
            )}
        </div>
    );
};

const DoctorCards = ({ cards }) => {
    if (!cards?.length) return null;
    return (
        <div className="mt-2 grid grid-cols-1 gap-2 max-w-[85%]">
            {cards.map((doc) => (
                <div key={doc._id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg border border-gray-100">
                    <img src={doc.image} alt={doc.name} className="w-10 h-10 rounded-full object-cover bg-white flex-shrink-0" />
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

const AppointmentCards = ({ cards }) => {
    if (!cards?.length) return null;
    return (
        <div className="mt-2 grid grid-cols-1 gap-2 max-w-[85%]">
            {cards.map((apt) => (
                <div key={apt._id} className="p-2 bg-white rounded-lg border border-gray-100">
                    <div className="flex items-center gap-3">
                        {apt.doctor?.image && (
                            <img src={apt.doctor.image} alt={apt.doctor.name || 'Doctor'} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                        )}
                        <div className="min-w-0 flex-1">
                            <div className="font-semibold text-[11px] text-gray-800 truncate">{apt.doctor?.name || 'Doctor'}</div>
                            <div className="text-[10px] text-gray-600 truncate">{apt.doctor?.designation}</div>
                            <div className="text-[10px] text-gray-500">{apt.slotDate} • {apt.slotTime}</div>
                            {apt.cancelled
                                ? <div className="text-[10px] text-red-500">Cancelled</div>
                                : apt.isCompleted
                                    ? <div className="text-[10px] text-green-600">Completed</div>
                                    : <div className="text-[10px] text-blue-600">Upcoming</div>
                            }
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const TypingIndicator = () => (
    <div className="mb-4 flex flex-col items-start">
        <div className="px-3 py-2.5 rounded-2xl bg-white border border-gray-100 rounded-bl-none shadow-sm flex gap-1 items-center">
            {[0, 150, 300].map((delay) => (
                <span
                    key={delay}
                    className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${delay}ms` }}
                />
            ))}
        </div>
    </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const Chatbot = ({ backendUrl, onAction }) => {
    const [{ messages, flow }, setState] = useState(makeInitialState);
    const [input, setInput]   = useState('');
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const chatEndRef = useRef(null);

    // Convenience setters
    const setMessages = (updater) =>
        setState((s) => ({ ...s, messages: typeof updater === 'function' ? updater(s.messages) : updater }));

    const setFlow = (updater) =>
        setState((s) => ({ ...s, flow: typeof updater === 'function' ? updater(s.flow) : { ...s.flow, ...updater } }));

    const setAll = (updater) =>
        setState((s) => typeof updater === 'function' ? updater(s) : { ...s, ...updater });

    useEffect(() => {
        if (!isOpen) return;
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    // ── Message helpers ────────────────────────────────────────────────────────

    /**
     * Deactivate options on all existing messages, then push new ones.
     * This prevents stale option buttons from being clickable.
     */
    const pushMessages = useCallback((...newMsgs) => {
        setMessages((prev) => [
            ...prev.map((m) => ({ ...m, optionsActive: false })),
            ...newMsgs.map((m) => ({ id: Date.now() + Math.random(), optionsActive: true, ...m }))
        ]);
    }, []);

    const pushBotPayload = useCallback((payload, options = null) => {
        if (onAction) onAction(payload);
        pushMessages({ sender: 'bot', payload, ...(options ? { options } : {}) });
    }, [onAction, pushMessages]);

    // ── Flow transitions ───────────────────────────────────────────────────────

    const resetToMenu = useCallback(() => {
        setFlow({
            mode: 'menu',
            waitingForSymptom: false,
            chatMode: 'guided',   // ← always reset chatMode
            lastSymptomText: '',
            bookingStep: null,
            bookingCity: ''
        });
        pushMessages({
            sender: 'bot',
            payload: {
                intent: 'general_question',
                response: 'What would you like to do next?',
                suggestions: [],
                follow_up_questions: [],
                urgency: 'low'
            },
            options: MENU_OPTIONS
        });
    }, [pushMessages]);

    const askSymptom = useCallback(() => {
        setFlow({ mode: 'symptom', waitingForSymptom: true });
        pushMessages({
            sender: 'bot',
            payload: {
                intent: 'symptom_check',
                response: "Tell me what you're noticing — pick one, or choose \"Other\" and type it.",
                suggestions: [],
                follow_up_questions: [],
                urgency: 'low'
            },
            options: SYMPTOM_OPTIONS.map((s) => ({ label: s, value: s }))
        });
    }, [pushMessages]);

    const startBookingFlow = useCallback(() => {
        setFlow({ mode: 'booking', bookingStep: 'ask_city', bookingCity: '', waitingForSymptom: false });
        pushMessages({
            sender: 'bot',
            payload: {
                intent: 'booking',
                response: 'Which city are you looking for? (Example: Bhubaneswar)',
                suggestions: [],
                follow_up_questions: [],
                urgency: 'low'
            },
            options: [{ label: 'Go back', value: 'Go back' }]
        });
    }, [pushMessages]);

    // ── Doctor lookup ──────────────────────────────────────────────────────────

    const getDoctorCity = (doc) => {
        const line2 = doc?.address?.line2 || '';
        return normalize(String(line2).split(',')[0] || line2);
    };

    const findDoctorsForCityAndSymptom = async (city, symptomText) => {
        if (!backendUrl) return [];
        const { data } = await axios.get(`${backendUrl}/api/doctor/list`);
        const doctors = data?.doctors || [];
        const cityNorm    = normalize(city);
        const symptomNorm = normalize(symptomText);

        const preferred = (() => {
            if (symptomNorm.includes('fever'))    return ['General physician'];
            if (symptomNorm.includes('headache')) return ['Neurologist', 'General physician'];
            if (symptomNorm.includes('rash'))     return ['Dermatologist'];
            if (symptomNorm.includes('stomach'))  return ['Gastroenterologist'];
            return [];
        })();

        return [...doctors]
            .filter((d) => getDoctorCity(d).includes(cityNorm))
            .sort((a, b) => (preferred.includes(b.speciality) ? 1 : 0) - (preferred.includes(a.speciality) ? 1 : 0))
            .slice(0, 3);
    };

    // ── After-symptom actions ──────────────────────────────────────────────────

    const respondSymptomWithActions = useCallback((symptomsText) => {
        setFlow((f) => ({ ...f, lastSymptomText: symptomsText, waitingForSymptom: false }));
        const payload = buildMoreTipsJson(symptomsText);
        if (onAction) onAction(payload);
        pushMessages(
            { sender: 'bot', payload },
            {
                sender: 'bot',
                payload: {
                    intent: 'general_question',
                    response: 'What would you like to do next?',
                    suggestions: [],
                    follow_up_questions: [],
                    urgency: payload.urgency
                },
                options: [
                    { label: 'More tips',                    value: 'More tips' },
                    { label: 'Should I consult a doctor?',   value: 'Should I consult a doctor?' },
                    { label: 'Go back',                      value: 'Go back' }
                ]
            }
        );
    }, [onAction, pushMessages]);

    // ── Option handler ─────────────────────────────────────────────────────────

    const handleOptionSelect = useCallback(async (optionValue, currentFlow) => {
        pushMessages({ sender: 'user', text: optionValue });

        if (optionValue === 'Go back') { resetToMenu(); return; }

        if (optionValue === 'Start Over') {
            setState(makeInitialState());
            return;
        }

        if (optionValue === 'Check Symptoms') {
            setFlow({ chatMode: 'guided' });
            askSymptom();
            return;
        }

        if (optionValue === 'Book Appointment' || optionValue === 'Find a Specialist') {
            startBookingFlow();
            return;
        }

        if (optionValue === 'View My Appointments') {
            pushBotPayload({
                intent: 'booking',
                response: 'To view your appointments, please open "My Appointments" in the app. I can also help you book a new one.',
                suggestions: ['Go to the "My Appointments" page in the app.'],
                follow_up_questions: ['Do you want to book a new appointment? If yes, which city and specialty?'],
                urgency: 'low'
            }, [
                { label: 'Book Appointment', value: 'Book Appointment' },
                { label: 'Go back',          value: 'Go back' }
            ]);
            return;
        }

        if (optionValue === 'General Inquiry') {
            setFlow({ chatMode: 'free', mode: 'general', waitingForSymptom: false });
            pushMessages({
                sender: 'bot',
                payload: {
                    intent: 'general_question',
                    response: "Sure — ask me anything about booking, payments, doctors, or how the app works.",
                    suggestions: [],
                    follow_up_questions: [],
                    urgency: 'low'
                }
            });
            return;
        }

        if (optionValue === 'More tips') {
            const last = currentFlow.lastSymptomText || 'symptoms';
            pushBotPayload(buildMoreTipsJson(last));
            return;
        }

        if (optionValue === 'Should I consult a doctor?') {
            const urgent = looksUrgent(currentFlow.lastSymptomText);
            pushBotPayload(
                {
                    intent: 'symptom_check',
                    response: urgent
                        ? 'Yes — please seek medical attention immediately due to potentially urgent symptoms.'
                        : "If symptoms are severe, persistent, worsening, or worrying to you, it's a good idea to consult a doctor.",
                    suggestions: urgent
                        ? ['Go to the nearest emergency department or call local emergency services now.']
                        : ['Book an appointment with a relevant specialist or a general physician.'],
                    follow_up_questions: urgent
                        ? []
                        : ['Do you want help booking?'],
                    urgency: urgent ? 'high' : 'low'
                },
                [
                    { label: 'Book Appointment', value: 'Book Appointment' },
                    { label: 'Go back',          value: 'Go back' }
                ]
            );
            return;
        }

        // Symptom option selected from the quick-pick list
        if (currentFlow.waitingForSymptom) {
            if (optionValue === 'Other (type it)') {
                // Keep waitingForSymptom true so the next typed message is treated as symptom input.
                pushMessages({
                    sender: 'bot',
                    payload: {
                        intent: 'symptom_check',
                        response: 'Please type your symptoms in your own words (e.g. "fever for 2 days with cough").',
                        suggestions: [],
                        follow_up_questions: [],
                        urgency: 'low'
                    }
                });
                return;
            }
            respondSymptomWithActions(optionValue);
            return;
        }

        // Fallback: treat as general question
        pushBotPayload(buildGeneralJson(optionValue), [{ label: 'Go back', value: 'Go back' }]);
    }, [askSymptom, pushBotPayload, pushMessages, resetToMenu, respondSymptomWithActions, startBookingFlow]);

    // ── Send handler ───────────────────────────────────────────────────────────

    const sendMessage = async (e) => {
        e.preventDefault();
        const typed = input.trim();
        if (!typed || loading) return;
        setInput('');

        // Capture flow at call-time (closure-safe)
        const f = flow;

        // Booking: waiting for city
        if (f.mode === 'booking' && f.bookingStep === 'ask_city') {
            pushMessages({ sender: 'user', text: typed });
            setFlow({ bookingCity: typed, bookingStep: 'show_doctors' });
            setLoading(true);
            try {
                const doctors = await findDoctorsForCityAndSymptom(typed, f.lastSymptomText || '');
                if (!doctors.length) {
                    // Reset to ask_city so the next typed message is treated as a new city, not a fallback
                    setFlow({ bookingStep: 'ask_city', bookingCity: '' });
                    pushMessages({
                        sender: 'bot',
                        payload: {
                            intent: 'booking',
                            response: `I couldn't find any doctors in "${typed}". Try a different city name, or go back.`,
                            suggestions: [],
                            follow_up_questions: [],
                            urgency: 'low'
                        },
                        options: [{ label: 'Go back', value: 'Go back' }]
                    });
                } else {
                    const doctor_cards = doctors.map((doc) => ({
                        _id: doc._id,
                        name: doc.name,
                        image: doc.image,
                        designation: doc.speciality,
                        experience: doc.experience
                    }));
                    pushMessages(
                        {
                            sender: 'bot',
                            payload: {
                                intent: 'booking',
                                response: `Here are doctors in ${typed} that match your needs:`,
                                suggestions: [],
                                follow_up_questions: [],
                                urgency: 'low'
                            },
                            doctorCards: doctor_cards
                        },
                        {
                            sender: 'bot',
                            payload: {
                                intent: 'general_question',
                                response: 'Would you like to do something else?',
                                suggestions: [],
                                follow_up_questions: [],
                                urgency: 'low'
                            },
                            options: [{ label: 'Go back', value: 'Go back' }]
                        }
                    );
                }
            } catch {
                setFlow({ bookingStep: 'ask_city', bookingCity: '' });
                pushMessages({
                    sender: 'bot',
                    payload: {
                        intent: 'booking',
                        response: "I had trouble loading doctors right now. Please try a different city or try again in a moment.",
                        suggestions: [],
                        follow_up_questions: [],
                        urgency: 'low'
                    },
                    options: [{ label: 'Go back', value: 'Go back' }]
                });
            } finally {
                setLoading(false);
            }
            return;
        }

        // Waiting for typed symptom
        if (f.waitingForSymptom) {
            pushMessages({ sender: 'user', text: typed });
            setFlow({ chatMode: 'guided' });
            respondSymptomWithActions(typed);
            return;
        }

        // Free chat mode
        if (f.chatMode === 'free') {
            pushMessages({ sender: 'user', text: typed });
            const payload = /pain|fever|cough|cold|rash|itch|vomit|diarrh|headache|migraine|breath|chest|dizz/i.test(typed)
                ? buildSymptomJson(typed)
                : buildGeneralJson(typed);
            pushBotPayload(payload);
            return;
        }

        // Guided mode: treat typed text the same as selecting an option
        await handleOptionSelect(typed, f);
    };

    // ── Render ─────────────────────────────────────────────────────────────────

    return (
        <>
            {/* FAB when closed */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 z-50 bg-primary text-white p-4 rounded-full shadow-xl hover:scale-105 transition-transform flex items-center justify-center"
                    title="Open UniBot"
                    aria-label="Open UniBot chat assistant"
                >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" />
                        <path d="M2 14h2" /><path d="M20 14h2" />
                        <path d="M15 13v2" /><path d="M9 13v2" />
                    </svg>
                </button>
            )}

            {isOpen && (
                <div
                    role="dialog"
                    aria-label="UniBot medical assistant"
                    className="fixed bottom-6 right-6 z-50 w-80 max-w-full bg-white border rounded-xl shadow-2xl flex flex-col h-[520px] overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-primary text-white px-4 py-3 font-semibold flex items-center justify-between shadow-sm flex-shrink-0">
                        <div className="flex items-center gap-2">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" />
                                <path d="M2 14h2" /><path d="M20 14h2" />
                                <path d="M15 13v2" /><path d="M9 13v2" />
                            </svg>
                            <span>UniBot</span>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-sm px-2 py-1 bg-primary/20 hover:bg-primary/30 rounded"
                            title="Close"
                            aria-label="Close chat"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-3 text-xs bg-gray-50/50">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`mb-4 flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                            >
                                {msg.sender === 'user' ? (
                                    <div className="px-3 py-2.5 rounded-2xl max-w-[85%] bg-primary text-white rounded-br-none shadow-sm text-xs break-words">
                                        {msg.text}
                                    </div>
                                ) : (
                                    <>
                                        <BotBubble payload={msg.payload} text={msg.text} />
                                        {msg.doctorCards      && <DoctorCards      cards={msg.doctorCards} />}
                                        {msg.appointmentCards && <AppointmentCards cards={msg.appointmentCards} />}
                                        {/* Options — only rendered when still active */}
                                        {msg.options && msg.optionsActive && (
                                            <div className="flex flex-col w-full max-w-[85%] mt-2 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                                {msg.options.map((opt, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => handleOptionSelect(opt.value, flow)}
                                                        disabled={loading}
                                                        className="text-left text-[11px] px-3 py-2.5 text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors disabled:opacity-50 border-b border-gray-100 last:border-b-0 break-words"
                                                    >
                                                        {opt.label}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        ))}

                        {/* Typing indicator during async load */}
                        {loading && <TypingIndicator />}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={sendMessage} className="flex border-t bg-white flex-shrink-0">
                        <input
                            className="flex-1 px-3 py-2.5 outline-none text-xs"
                            type="text"
                            placeholder={
                                flow.waitingForSymptom
                                    ? 'Type your symptom…'
                                    : flow.chatMode === 'free'
                                        ? 'Ask a question…'
                                        : 'Type a message…'
                            }
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={loading}
                            aria-label="Message input"
                        />
                        <button
                            className="px-4 py-2.5 bg-primary text-white text-xs font-medium disabled:opacity-50"
                            type="submit"
                            disabled={loading || !input.trim()}
                            aria-label="Send message"
                        >
                            {loading ? '…' : 'Send'}
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};

export default Chatbot;