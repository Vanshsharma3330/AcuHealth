import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export const sendPaymentEmail = async (userEmail, type, data) => {
  const templates = {
    paymentInitiated: {
      subject: 'Payment Initiated for Your Appointment',
      html: `
        <h2>Payment Initiated</h2>
        <p>Dear ${data.userName},</p>
        <p>A payment of $${data.amount} has been initiated for your appointment with Dr. ${data.doctorName}.</p>
        <p>Appointment Details:</p>
        <ul>
          <li>Date: ${data.appointmentDate}</li>
          <li>Time: ${data.appointmentTime}</li>
          <li>Transaction ID: ${data.transactionId}</li>
        </ul>
        <p>Please complete the payment to confirm your appointment.</p>
      `
    },
    paymentCompleted: {
      subject: 'Payment Completed Successfully',
      html: `
        <h2>Payment Successful</h2>
        <p>Dear ${data.userName},</p>
        <p>Your payment of $${data.amount} has been completed successfully.</p>
        <p>Appointment Details:</p>
        <ul>
          <li>Date: ${data.appointmentDate}</li>
          <li>Time: ${data.appointmentTime}</li>
          <li>Transaction ID: ${data.transactionId}</li>
        </ul>
        <p>Your appointment is now confirmed. We look forward to seeing you!</p>
      `
    },
    paymentRefunded: {
      subject: 'Payment Refund Processed',
      html: `
        <h2>Payment Refunded</h2>
        <p>Dear ${data.userName},</p>
        <p>Your payment of $${data.amount} has been refunded.</p>
        <p>Refund Details:</p>
        <ul>
          <li>Transaction ID: ${data.transactionId}</li>
          <li>Refund Date: ${data.refundDate}</li>
          <li>Reason: ${data.refundReason}</li>
        </ul>
        <p>The refunded amount will be credited to your account within 5-7 business days.</p>
      `
    },
    paymentFailed: {
      subject: 'Payment Failed',
      html: `
        <h2>Payment Failed</h2>
        <p>Dear ${data.userName},</p>
        <p>Your payment of $${data.amount} has failed.</p>
        <p>Transaction Details:</p>
        <ul>
          <li>Transaction ID: ${data.transactionId}</li>
          <li>Date: ${data.paymentDate}</li>
        </ul>
        <p>Please try again or contact our support team for assistance.</p>
      `
    }
  };

  const template = templates[type];
  if (!template) {
    throw new Error('Invalid email template type');
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: template.subject,
    html: template.html
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Payment email sent successfully to ${userEmail}`);
  } catch (error) {
    console.error('Error sending payment email:', error);
    throw error;
  }
}; 