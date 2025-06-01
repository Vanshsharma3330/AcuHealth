import express from 'express';
import { authenticate } from '../auth/verifyToken.js';
import {
  createPayment,
  updatePaymentStatus,
  getPaymentDetails,
  getDoctorPayments
} from '../Controllers/paymentController.js';

const router = express.Router();

// Create payment
router.post('/', authenticate, createPayment);

// Update payment status
router.patch('/:paymentId', authenticate, updatePaymentStatus);

// Get payment details
router.get('/:paymentId', authenticate, getPaymentDetails);

// Get doctor's payments
router.get('/doctor/payments', authenticate, getDoctorPayments);

export default router; 