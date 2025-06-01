import Payment from '../models/PaymentSchema.js';
import Booking from '../models/BookingSchema.js';
import Doctor from '../models/DoctorSchema.js';
import User from '../models/UserSchema.js';
import { createNotification } from './notificationController.js';
import { sendPaymentEmail } from '../utils/emailService.js';
import { v4 as uuidv4 } from 'uuid';

// Create a new payment
export const createPayment = async (req, res) => {
  try {
    const { bookingId, paymentMethod } = req.body;

    const booking = await Booking.findById(bookingId)
      .populate('doctor')
      .populate('user');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Create payment record
    const payment = await Payment.create({
      booking: bookingId,
      doctor: booking.doctor._id,
      user: booking.user._id,
      amount: booking.doctor.ticketPrice,
      paymentMethod,
      transactionId: uuidv4(),
      status: 'pending'
    });

    // Update booking with payment reference
    booking.payment = payment._id;
    await booking.save();

    // Create notification for user
    await createNotification(
      booking.user._id,
      'payment',
      `Payment of $${booking.doctor.ticketPrice} is pending for your appointment`
    );

    // Send email notification
    await sendPaymentEmail(booking.user.email, 'paymentInitiated', {
      userName: booking.user.name,
      doctorName: booking.doctor.name,
      amount: booking.doctor.ticketPrice,
      appointmentDate: booking.appointmentDate,
      appointmentTime: booking.appointmentTime,
      transactionId: payment.transactionId
    });

    res.status(200).json({
      success: true,
      message: 'Payment initiated successfully',
      data: payment
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error creating payment'
    });
  }
};

// Update payment status
export const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { status, refundReason } = req.body;

    const payment = await Payment.findById(paymentId)
      .populate('booking')
      .populate('user')
      .populate('doctor');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    payment.status = status;
    
    if (status === 'refunded') {
      payment.refundDate = new Date();
      payment.refundReason = refundReason;
    }

    await payment.save();

    // Update booking status based on payment status
    if (status === 'completed') {
      payment.booking.status = 'approved';
      await payment.booking.save();
    }

    // Create notification for user
    await createNotification(
      payment.user._id,
      'payment',
      `Your payment has been ${status}`
    );

    // Send email notification based on status
    const emailData = {
      userName: payment.user.name,
      amount: payment.amount,
      transactionId: payment.transactionId,
      appointmentDate: payment.booking.appointmentDate,
      appointmentTime: payment.booking.appointmentTime
    };

    if (status === 'completed') {
      await sendPaymentEmail(payment.user.email, 'paymentCompleted', emailData);
    } else if (status === 'refunded') {
      await sendPaymentEmail(payment.user.email, 'paymentRefunded', {
        ...emailData,
        refundDate: payment.refundDate,
        refundReason: payment.refundReason
      });
    } else if (status === 'failed') {
      await sendPaymentEmail(payment.user.email, 'paymentFailed', {
        ...emailData,
        paymentDate: payment.paymentDate
      });
    }

    res.status(200).json({
      success: true,
      message: 'Payment status updated successfully',
      data: payment
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error updating payment status'
    });
  }
};

// Get payment details
export const getPaymentDetails = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await Payment.findById(paymentId)
      .populate('booking')
      .populate('doctor')
      .populate('user');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Payment details found',
      data: payment
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payment details'
    });
  }
};

// Get doctor's payments
export const getDoctorPayments = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.userId });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    const payments = await Payment.find({ doctor: doctor._id })
      .populate('booking')
      .populate('user')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Payments found',
      data: payments
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payments'
    });
  }
}; 