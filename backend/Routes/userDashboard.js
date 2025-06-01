import express from 'express'
import { authenticate } from '../auth/verifyToken.js'
import { 
    getUserProfile,
    updateUserProfile,
    getUserDashboardStats,
    getFavoriteDoctors,
    toggleFavoriteDoctor
} from '../Controllers/userDashboardController.js'

const router = express.Router()

router.get('/profile', authenticate, getUserProfile)
router.put('/profile', authenticate, updateUserProfile)
router.get('/stats', authenticate, getUserDashboardStats)
router.get('/favorites', authenticate, getFavoriteDoctors)
router.post('/favorites/:doctorId', authenticate, toggleFavoriteDoctor)

export default router; 