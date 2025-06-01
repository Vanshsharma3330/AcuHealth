import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: Number },
  photo: { type: String },
  ticketPrice: { type: Number, required: true },
  role: {
    type: String,
  },

  // Fields for doctors only
  specialization: { type: String, required: true },
  qualifications: [{
    degree: { type: String, required: true },
    institution: { type: String, required: true },
    year: { type: Number, required: true }
  }],

  experience: {
    type: Number,
    required: true
  },

  bio: { type: String, required: true },
  about: { type: String },
  timeSlots: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: true
    },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true }
  }],
  reviews: [{ type: mongoose.Types.ObjectId, ref: "Review" }],
  averageRating: {
    type: Number,
    default: 0,
  },
  totalRating: {
    type: Number,
    default: 0,
  },
  isApproved: {
    type: String,
    enum: ["pending", "approved", "cancelled"],
    default: "pending",
  },
  appointments: [{ type: mongoose.Types.ObjectId, ref: "Booking" }],
  notifications: [{
    type: {
      type: String,
      enum: ['appointment', 'system', 'review'],
      required: true
    },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }],
  documents: [{
    type: { type: String, required: true },
    url: { type: String, required: true },
    verified: { type: Boolean, default: false }
  }]
}, { timestamps: true });

export default mongoose.model("Doctor", DoctorSchema);
