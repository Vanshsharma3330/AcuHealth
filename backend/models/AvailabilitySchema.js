import mongoose from 'mongoose'

const AvailabilitySchema = new mongoose.Schema({
    doctor: {
        type: mongoose.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    dayOfWeek: {
        type: Number,
        required: true,
        min: 0,
        max: 6 // 0 = Sunday, 6 = Saturday
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    slotDuration: {
        type: Number,
        required: true,
        default: 30 // in minutes
    }
}, { timestamps: true })

// Prevent duplicate availability entries for the same doctor on the same day
AvailabilitySchema.index({ doctor: 1, dayOfWeek: 1 }, { unique: true })

export default mongoose.model('Availability', AvailabilitySchema) 