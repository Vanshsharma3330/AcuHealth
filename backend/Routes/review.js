import express from 'express'
import { authenticate } from '../auth/verifyToken.js'
import { 
    getAllReviews, 
    createReview, 
    updateReview, 
    deleteReview 
} from '../Controllers/reviewController.js'

const router = express.Router()

router.get('/', getAllReviews)
router.post('/:doctorId', authenticate, createReview)
router.put('/:id', authenticate, updateReview)
router.delete('/:id', authenticate, deleteReview)

export default router;