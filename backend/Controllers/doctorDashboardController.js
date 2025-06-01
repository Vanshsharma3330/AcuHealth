import Doctor from '../models/DoctorSchema.js'
import Booking from '../models/BookingSchema.js'
import Review from '../models/ReviewSchema.js'
import User from '../models/UserSchema.js'
import { createNotification } from './notificationController.js'

// Get doctor profile
export const getDoctorProfile = async(req,res)=>{
    try {
        const doctor = await Doctor.findOne({user: req.userId})
            .populate('user', 'name email photo')
        
        if(!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            })
        }

        res.status(200).json({
            success: true,
            message: 'Profile found',
            data: doctor
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error fetching profile'
        })
    }
}

// Update doctor profile
export const updateDoctorProfile = async(req,res)=>{
    try {
        const doctor = await Doctor.findOne({user: req.userId})
        
        if(!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            })
        }

        const updatedDoctor = await Doctor.findByIdAndUpdate(
            doctor._id,
            req.body,
            { new: true }
        ).populate('user', 'name email photo')

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: updatedDoctor
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error updating profile'
        })
    }
}

// Get doctor dashboard stats
export const getDoctorDashboardStats = async(req,res)=>{
    try {
        const doctor = await Doctor.findOne({user: req.userId})
        
        if(!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            })
        }

        // Get total appointments
        const totalAppointments = await Booking.countDocuments({ doctor: doctor._id })
        
        // Get today's appointments
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

        const todayAppointments = await Booking.find({
            doctor: doctor._id,
            appointmentDate: {
                $gte: today,
                $lt: tomorrow
            }
        })
        .populate('user', 'name photo')
        .sort({ appointmentTime: 1 })

        // Get upcoming appointments
        const upcomingAppointments = await Booking.find({
            doctor: doctor._id,
            appointmentDate: { $gte: tomorrow },
            status: { $in: ['approved', 'pending'] }
        })
        .populate('user', 'name photo')
        .sort({ appointmentDate: 1 })
        .limit(5)

        // Get total reviews
        const totalReviews = await Review.countDocuments({ doctor: doctor._id })

        // Get recent reviews
        const recentReviews = await Review.find({ doctor: doctor._id })
            .populate('user', 'name photo')
            .sort({ createdAt: -1 })
            .limit(5)

        res.status(200).json({
            success: true,
            message: 'Dashboard stats found',
            data: {
                totalAppointments,
                todayAppointments,
                upcomingAppointments,
                totalReviews,
                recentReviews,
                averageRating: doctor.averageRating
            }
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard stats'
        })
    }
}

// Update appointment status
export const updateAppointmentStatus = async(req,res)=>{
    try {
        const { bookingId } = req.params
        const { status } = req.body

        const booking = await Booking.findById(bookingId)
        
        if(!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            })
        }

        const doctor = await Doctor.findOne({user: req.userId})
        
        if(booking.doctor.toString() !== doctor._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this booking'
            })
        }

        booking.status = status
        await booking.save()

        // Create notification for user
        await createNotification(
            booking.user,
            'appointment',
            `Your appointment has been ${status}`
        )

        res.status(200).json({
            success: true,
            message: 'Appointment status updated successfully',
            data: booking
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error updating appointment status'
        })
    }
}

// Get doctor's patients
export const getDoctorPatients = async(req,res)=>{
    try {
        const doctor = await Doctor.findOne({user: req.userId})
        
        if(!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            })
        }

        const bookings = await Booking.find({ doctor: doctor._id })
            .populate('user', 'name photo email phone')
            .sort({ appointmentDate: -1 })

        // Get unique patients
        const patients = [...new Map(bookings.map(booking => 
            [booking.user._id.toString(), booking.user]
        )).values()]

        res.status(200).json({
            success: true,
            message: 'Patients found',
            data: patients
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error fetching patients'
        })
    }
} 