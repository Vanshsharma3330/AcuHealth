import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Types.ObjectId,
    ref: "Booking",
    required: true
  },
  doctor: {
    type: mongoose.Types.ObjectId,
    ref: "Doctor",
    required: true
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: "USD"
  },
  status: {
    type: String,
    required: true,
    enum: ["pending", "completed", "failed", "refunded"],
    default: "pending"
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ["credit_card", "debit_card", "bank_transfer"]
  },
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  refundDate: {
    type: Date
  },
  refundReason: {
    type: String
  },
  receipt: {
    type: String // URL to the payment receipt
  }
}, { timestamps: true });

export default mongoose.model("Payment", PaymentSchema); 