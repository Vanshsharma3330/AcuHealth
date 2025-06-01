import User from '../models/UserSchema.js'
import Booking from '../models/BookingSchema.js'
import Doctor from '../models/DoctorSchema.js'
import Review from '../models/ReviewSchema.js'

// Get user profile
export const getUserProfile = async(req,res)=>{
    try {
        const user = await User.findById(req.userId)
            .select('-password')
        
        if(!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        res.status(200).json({
            success: true,
            message: 'Profile found',
            data: user
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error fetching profile'
        })
    }
}

// Update user profile
export const updateUserProfile = async(req,res)=>{
    try {
        const user = await User.findById(req.userId)
        
        if(!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            req.body,
            { new: true }
        ).select('-password')

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: updatedUser
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error updating profile'
        })
    }
}

// Get user dashboard stats
export const getUserDashboardStats = async(req,res)=>{
    try {
        const user = await User.findById(req.userId)
        
        if(!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        // Get total bookings
        const totalBookings = await Booking.countDocuments({ user: req.userId })
        
        // Get upcoming appointments
        const upcomingAppointments = await Booking.find({
            user: req.userId,
            appointmentDate: { $gte: new Date() },
            status: { $in: ['approved', 'pending'] }
        })
        .populate('doctor', 'name photo specialization')
        .sort({ appointmentDate: 1 })
        .limit(5)

        // Get past appointments
        const pastAppointments = await Booking.find({
            user: req.userId,
            appointmentDate: { $lt: new Date() }
        })
        .populate('doctor', 'name photo specialization')
        .sort({ appointmentDate: -1 })
        .limit(5)

        // Get total reviews
        const totalReviews = await Review.countDocuments({ user: req.userId })

        res.status(200).json({
            success: true,
            message: 'Dashboard stats found',
            data: {
                totalBookings,
                upcomingAppointments,
                pastAppointments,
                totalReviews
            }
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard stats'
        })
    }
}

// Get user's favorite doctors
export const getFavoriteDoctors = async(req,res)=>{
    try {
        const user = await User.findById(req.userId)
            .populate('favoriteDoctors')
        
        if(!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        res.status(200).json({
            success: true,
            message: 'Favorite doctors found',
            data: user.favoriteDoctors
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error fetching favorite doctors'
        })
    }
}

// Add/Remove favorite doctor
export const toggleFavoriteDoctor = async(req,res)=>{
    try {
        const user = await User.findById(req.userId)
        
        if(!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        const doctorId = req.params.doctorId
        const isFavorite = user.favoriteDoctors.includes(doctorId)

        if(isFavorite) {
            user.favoriteDoctors = user.favoriteDoctors.filter(
                id => id.toString() !== doctorId
            )
        } else {
            user.favoriteDoctors.push(doctorId)
        }

        await user.save()

        res.status(200).json({
            success: true,
            message: isFavorite ? 'Doctor removed from favorites' : 'Doctor added to favorites',
            data: user.favoriteDoctors
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error updating favorite doctors'
        })
    }
} 