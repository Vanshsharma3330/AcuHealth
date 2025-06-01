import Availability from '../models/AvailabilitySchema.js'
import Doctor from '../models/DoctorSchema.js'
import Booking from '../models/BookingSchema.js'

// Set availability
export const setAvailability = async(req,res)=>{
    try {
        const doctor = await Doctor.findOne({user: req.userId})
        
        if(!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            })
        }

        const availability = new Availability({
            ...req.body,
            doctor: doctor._id
        })

        await availability.save()

        res.status(200).json({
            success: true,
            message: 'Availability set successfully',
            data: availability
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error setting availability'
        })
    }
}

// Get availability
export const getAvailability = async(req,res)=>{
    try {
        const doctor = await Doctor.findById(req.params.doctorId)
        
        if(!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            })
        }

        const availability = await Availability.find({doctor: doctor._id})

        res.status(200).json({
            success: true,
            message: 'Availability found',
            data: availability
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error fetching availability'
        })
    }
}

// Update availability
export const updateAvailability = async(req,res)=>{
    try {
        const doctor = await Doctor.findOne({user: req.userId})
        
        if(!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            })
        }

        const availability = await Availability.findOne({
            doctor: doctor._id,
            dayOfWeek: req.params.dayOfWeek
        })

        if(!availability) {
            return res.status(404).json({
                success: false,
                message: 'Availability not found'
            })
        }

        const updatedAvailability = await Availability.findByIdAndUpdate(
            availability._id,
            req.body,
            { new: true }
        )

        res.status(200).json({
            success: true,
            message: 'Availability updated successfully',
            data: updatedAvailability
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error updating availability'
        })
    }
}

// Get available slots
export const getAvailableSlots = async(req,res)=>{
    try {
        const { doctorId, date } = req.params
        const doctor = await Doctor.findById(doctorId)
        
        if(!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            })
        }

        // Get day of week (0-6)
        const dayOfWeek = new Date(date).getDay()

        // Get doctor's availability for this day
        const availability = await Availability.findOne({
            doctor: doctorId,
            dayOfWeek
        })

        if(!availability || !availability.isAvailable) {
            return res.status(200).json({
                success: true,
                message: 'No availability for this day',
                data: []
            })
        }

        // Get all bookings for this date
        const bookings = await Booking.find({
            doctor: doctorId,
            appointmentDate: date,
            status: { $in: ['approved', 'pending'] }
        })

        // Generate time slots
        const slots = []
        const startTime = new Date(`2000-01-01T${availability.startTime}`)
        const endTime = new Date(`2000-01-01T${availability.endTime}`)
        const slotDuration = availability.slotDuration

        while(startTime < endTime) {
            const slotTime = startTime.toTimeString().slice(0,5)
            const isBooked = bookings.some(booking => 
                booking.appointmentTime === slotTime
            )

            if(!isBooked) {
                slots.push(slotTime)
            }

            startTime.setMinutes(startTime.getMinutes() + slotDuration)
        }

        res.status(200).json({
            success: true,
            message: 'Available slots found',
            data: slots
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error fetching available slots'
        })
    }
} 