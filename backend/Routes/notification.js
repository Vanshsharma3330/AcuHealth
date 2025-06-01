import express from 'express'
import { authenticate } from '../auth/verifyToken.js'
import { 
    getUserNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification
} from '../Controllers/notificationController.js'

const router = express.Router()

router.get('/', authenticate, getUserNotifications)
router.patch('/:notificationId/read', authenticate, markNotificationAsRead)
router.patch('/read-all', authenticate, markAllNotificationsAsRead)
router.delete('/:notificationId', authenticate, deleteNotification)

export default router; 