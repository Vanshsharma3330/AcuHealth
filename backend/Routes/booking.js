import express from 'express'
import { authenticate } from '../auth/verifyToken.js'
import { 
    getCheckoutSession, 
    getUserBookings, 
    cancelBooking, 
    rescheduleBooking,
    getDoctorBookings,
    verifyPayment 
} from '../Controllers/bookingController.js'

const router = express.Router()

router.post('/checkout-session/:doctorId', authenticate, getCheckoutSession)
router.get('/verify-payment/:sessionId', authenticate, verifyPayment)
router.get('/my-appointments', authenticate, getUserBookings)
router.get('/doctor-appointments', authenticate, getDoctorBookings)
router.patch('/cancel/:bookingId', authenticate, cancelBooking)
router.patch('/reschedule/:bookingId', authenticate, rescheduleBooking)

export default router;