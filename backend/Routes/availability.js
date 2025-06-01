import express from 'express'
import { authenticate } from '../auth/verifyToken.js'
import { 
    setAvailability, 
    getAvailability, 
    updateAvailability, 
    getAvailableSlots 
} from '../Controllers/availabilityController.js'

const router = express.Router()

router.post('/', authenticate, setAvailability)
router.get('/:doctorId', getAvailability)
router.get('/:doctorId/slots/:date', getAvailableSlots)
router.patch('/:dayOfWeek', authenticate, updateAvailability)

export default router; 