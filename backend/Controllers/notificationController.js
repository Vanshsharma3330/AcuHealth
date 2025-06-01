import User from '../models/UserSchema.js'
import Doctor from '../models/DoctorSchema.js'
import Booking from '../models/BookingSchema.js'

// Get user notifications
export const getUserNotifications = async(req,res)=>{
    try {
        const user = await User.findById(req.userId)
        
        if(!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        res.status(200).json({
            success: true,
            message: 'Notifications found',
            data: user.notifications
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error fetching notifications'
        })
    }
}

// Mark notification as read
export const markNotificationAsRead = async(req,res)=>{
    try {
        const user = await User.findById(req.userId)
        
        if(!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        const notification = user.notifications.id(req.params.notificationId)
        
        if(!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            })
        }

        notification.read = true
        await user.save()

        res.status(200).json({
            success: true,
            message: 'Notification marked as read'
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error updating notification'
        })
    }
}

// Mark all notifications as read
export const markAllNotificationsAsRead = async(req,res)=>{
    try {
        const user = await User.findById(req.userId)
        
        if(!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        user.notifications.forEach(notification => {
            notification.read = true
        })

        await user.save()

        res.status(200).json({
            success: true,
            message: 'All notifications marked as read'
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error updating notifications'
        })
    }
}

// Delete notification
export const deleteNotification = async(req,res)=>{
    try {
        const user = await User.findById(req.userId)
        
        if(!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        user.notifications = user.notifications.filter(
            notification => notification._id.toString() !== req.params.notificationId
        )

        await user.save()

        res.status(200).json({
            success: true,
            message: 'Notification deleted'
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error deleting notification'
        })
    }
}

// Create notification (internal use)
export const createNotification = async(userId, type, message)=>{
    try {
        const user = await User.findById(userId)
        
        if(!user) {
            return false
        }

        user.notifications.push({
            type,
            message,
            read: false
        })

        await user.save()
        return true
    } catch (err) {
        return false
    }
} 