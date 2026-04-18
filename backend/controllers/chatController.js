import doctorModel from "../models/doctorModel.js";
import slotModel from "../models/slotModel.js";

const symptomToSpeciality = {
    fever: "General physician",
    cough: "General physician",
    cold: "General physician",
    flu: "General physician",
    skin: "Dermatologist",
    rash: "Dermatologist",
    acne: "Dermatologist",
    headache: "Neurologist",
    migraine: "Neurologist",
    child: "Pediatrician",
    baby: "Pediatrician",
    pregnancy: "Gynecologist",
    period: "Gynecologist",
    stomach: "Gastroenterologist",
    digestion: "Gastroenterologist",
    heart: "Cardiologist",
    "chest pain": "Cardiologist",
    bone: "Orthopedic",
    joint: "Orthopedic",
    eye: "Ophthalmologist",
    ear: "ENT",
    nose: "ENT",
    throat: "ENT"
};

const specialityAliases = {
    "general physician": "General physician",
    dermatologist: "Dermatologist",
    neurologist: "Neurologist",
    pediatrician: "Pediatrician",
    gynecologist: "Gynecologist",
    gastroenterologist: "Gastroenterologist",
    cardiologist: "Cardiologist",
    orthopedic: "Orthopedic",
    orthopaedic: "Orthopedic",
    ophthalmologist: "Ophthalmologist",
    ent: "ENT"
};

const faqAnswers = [
    {
        keywords: ["book", "appointment"],
        response: "To book an appointment, choose a doctor and select an available time slot."
    },
    {
        keywords: ["payment", "pay"],
        response: "We support online payments through the payment options available in the app."
    },
    {
        keywords: ["cancel", "appointment"],
        response: "You can cancel an appointment from the My Appointments section."
    },
    {
        keywords: ["profile", "update"],
        response: "You can update your profile details from the My Profile page."
    }
];

const emergencyKeywords = ["emergency", "severe", "unconscious", "stroke", "heart attack", "trouble breathing", "difficulty breathing", "bleeding"];

const normalize = (value = "") => value.toLowerCase().trim();

const addSafetySuffix = (text) => {
    if (/consult a qualified doctor/i.test(text)) {
        return text;
    }

    return `${text} Always consult a qualified doctor.`;
};

const formatSlotDate = (date = new Date()) => `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`;

const detectSpeciality = (message) => {
    const lowerMessage = normalize(message);

    for (const [alias, speciality] of Object.entries(specialityAliases)) {
        if (lowerMessage.includes(alias)) {
            return speciality;
        }
    }

    for (const [symptom, speciality] of Object.entries(symptomToSpeciality)) {
        if (lowerMessage.includes(symptom)) {
            return speciality;
        }
    }

    return "";
};

const detectIntent = (message) => {
    const lowerMessage = normalize(message);

    if (emergencyKeywords.some((keyword) => lowerMessage.includes(keyword))) {
        return "urgency";
    }

    if (lowerMessage.includes("book") || lowerMessage.includes("slot") || lowerMessage.includes("availability")) {
        return "booking";
    }

    if (Object.keys(symptomToSpeciality).some((keyword) => lowerMessage.includes(keyword))) {
        return "symptom_check";
    }

    return "faq";
};

const buildFaqResponse = (message) => {
    const lowerMessage = normalize(message);
    const matchedFaq = faqAnswers.find(({ keywords }) => keywords.every((keyword) => lowerMessage.includes(keyword)));

    if (matchedFaq) {
        return matchedFaq.response;
    }

    return "I can help with finding doctors, checking appointment availability, and answering booking questions.";
};

const findDoctorsBySpeciality = async (speciality) => {
    if (!speciality) {
        return [];
    }

    return doctorModel.find({
        speciality: { $regex: `^${speciality}$`, $options: "i" }
    });
};

export const chatHandler = async (req, res) => {
    try {
        const message = req.body?.message?.trim();

        if (!message) {
            return res.status(400).json({
                success: false,
                response_text: "Please enter a message so I can help."
            });
        }

        const intent = detectIntent(message);
        const speciality = detectSpeciality(message);
        const urgency_level = intent === "urgency" ? "emergency" : "low";
        const date = formatSlotDate();

        let response_text = "";
        let doctors = [];
        let slots = [];

        if (intent === "urgency") {
            response_text = "This may be urgent. Please visit the nearest hospital or contact emergency services immediately.";
        } else if (intent === "booking") {
            doctors = await findDoctorsBySpeciality(speciality);

            if (!speciality) {
                response_text = "Tell me the speciality or symptom, and I can help you find the right doctor.";
            } else if (!doctors.length) {
                response_text = `I could not find any ${speciality} doctors right now. Please try another speciality or check again later.`;
            } else {
                slots = await slotModel.find({ doctorId: doctors[0]._id, date });
                response_text = `I found ${doctors.length} ${speciality} doctor${doctors.length > 1 ? "s" : ""}. Here are the current slots for ${doctors[0].name}.`;
            }
        } else if (intent === "symptom_check") {
            doctors = await findDoctorsBySpeciality(speciality);

            if (speciality && doctors.length) {
                response_text = `Based on what you described, you can consult a ${speciality}. I found ${doctors.length} matching doctor${doctors.length > 1 ? "s" : ""}.`;
            } else if (speciality) {
                response_text = `Your symptoms may be relevant to a ${speciality}, but I could not find a matching doctor right now.`;
            } else {
                response_text = "Please share a bit more about your symptoms so I can suggest the right speciality.";
            }
        } else {
            response_text = buildFaqResponse(message);
        }

        return res.json({
            success: true,
            intent,
            speciality,
            date,
            urgency_level,
            response_text: addSafetySuffix(response_text),
            doctors,
            slots
        });
    } catch (error) {
        console.error("Chat handler error:", error);
        return res.status(500).json({
            success: false,
            response_text: "The chatbot is temporarily unavailable. Please try again in a moment."
        });
    }
};
