import mongoose from "mongoose";

const slotSchema = new mongoose.Schema({
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'doctor', required: true },
    date: { type: String, required: true }, // format: DD_MM_YYYY
    time: { type: String, required: true }, // e.g. "10:00 AM"
    isBooked: { type: Boolean, default: false },
    bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user', default: null }
}, { timestamps: true });

slotSchema.index({ doctorId: 1, date: 1, time: 1 }, { unique: true });

const slotModel = mongoose.models.slot || mongoose.model('slot', slotSchema);
export default slotModel;
