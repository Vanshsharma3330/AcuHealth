import express from 'express'
import { authenticate } from '../auth/verifyToken.js'
import { 
    getCheckoutSession, 
    getUserBookings, 
    cancelBooking, 
    rescheduleBooking,
    getDoctorBookings 
} from '../Controllers/bookingController.js'

const router = express.Router()

router.post('/checkout-session/:doctorId', authenticate, getCheckoutSession)
router.get('/user-bookings', authenticate, getUserBookings)
router.get('/doctor-bookings', authenticate, getDoctorBookings)
router.patch('/cancel/:bookingId', authenticate, cancelBooking)
router.patch('/reschedule/:bookingId', authenticate, rescheduleBooking)

export default router;