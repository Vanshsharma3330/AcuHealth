import express from 'express'
import { authenticate } from '../auth/verifyToken.js'
import { 
    getDoctorProfile,
    updateDoctorProfile,
    getDoctorDashboardStats,
    updateAppointmentStatus,
    getDoctorPatients
} from '../Controllers/doctorDashboardController.js'

const router = express.Router()

router.get('/profile', authenticate, getDoctorProfile)
router.put('/profile', authenticate, updateDoctorProfile)
router.get('/stats', authenticate, getDoctorDashboardStats)
router.patch('/appointments/:bookingId', authenticate, updateAppointmentStatus)
router.get('/patients', authenticate, getDoctorPatients)

export default router; 