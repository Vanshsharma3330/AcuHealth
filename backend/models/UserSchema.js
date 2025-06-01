import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String },
  photo: { type: String },
  role: {
    type: String,
    enum: ["patient", "admin"],
    default: "patient",
  },
  gender: { type: String, enum: ["male", "female", "other"] },
  bloodType: { type: String },
  appointments: [{ type: mongoose.Types.ObjectId, ref: "Booking" }],
  favoriteDoctors: [{ type: mongoose.Types.ObjectId, ref: "Doctor" }],
  notifications: [{
    type: {
      type: String,
      enum: ["appointment", "system", "payment"],
      required: true
    },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }],
  medicalHistory: [{
    condition: { type: String },
    diagnosis: { type: String },
    date: { type: Date },
    doctor: { type: mongoose.Types.ObjectId, ref: "Doctor" }
  }],
  emergencyContact: {
    name: { type: String },
    relationship: { type: String },
    phone: { type: String }
  }
}, { timestamps: true });

export default mongoose.model("User", UserSchema);
