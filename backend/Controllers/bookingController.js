import User from '../models/UserSchema.js'
import Doctor from '../models/DoctorSchema.js'
import Booking from '../models/BookingSchema.js'

import Stripe from 'stripe'

export const getCheckoutSession = async(req,res)=>{
    try {
        console.log('Starting checkout session creation...')
        console.log('Doctor ID:', req.params.doctorId)
        console.log('User ID:', req.userId)
        
        //get currently booked doctor
        const doctor = await Doctor.findById(req.params.doctorId)
        if (!doctor) {
            console.error('Doctor not found:', req.params.doctorId)
            return res.status(404).json({success:false, message:"Doctor not found"})
        }
        console.log('Doctor found:', doctor.name)

        const user = await User.findById(req.userId)
        if (!user) {
            console.error('User not found:', req.userId)
            return res.status(404).json({success:false, message:"User not found"})
        }
        console.log('User found:', user.name)

        if (!process.env.STRIPE_SECRET_KEY) {
            console.log('Stripe not configured, creating direct booking')
            // If Stripe is not configured, create a booking directly
            const booking = new Booking({
                doctor: doctor._id,
                user: user._id,
                ticketPrice: doctor.ticketPrice,
                session: 'direct_booking',
                status: 'pending',
                appointmentDate: new Date(),
                appointmentTime: '09:00'
            })

            await booking.save()
            console.log('Direct booking created successfully')

            return res.status(200).json({
                success: true,
                message: "Booking created successfully",
                data: booking
            })
        }

        console.log('Creating Stripe checkout session...')
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
        
        // Get the frontend URL from the request origin
        const frontendUrl = req.headers.origin || process.env.CLIENT_SITE_URL || 'http://localhost:5174'
        
        //create stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types:['card'],
            mode:'payment',
            success_url:`http://localhost:5174/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url:`http://localhost:5174/doctors/${doctor.id}`,
            customer_email: user.email,
            client_reference_id: req.params.doctorId,
            line_items:[
                {
                    price_data:{
                        currency:'usd',
                        unit_amount:doctor.ticketPrice * 100,
                        product_data:{
                            name:doctor.name,
                            description:doctor.bio,
                            images:[doctor.photo]
                        }
                    },
                    quantity:1
                }
            ]
        })
        console.log('Stripe session created:', session.id)

        //create new booking
        const booking = new Booking({
            doctor:doctor._id,
            user: user._id,
            ticketPrice: doctor.ticketPrice,
            session: session.id,
            status: 'pending',
            appointmentDate: new Date(),
            appointmentTime: '09:00'
        })

        await booking.save()
        console.log('Booking saved successfully')

        res.status(200).json({success:true, message:"Successfully paid", session})
    } catch (err) {
        console.error('Checkout session error:', err)
        console.error('Error details:', {
            message: err.message,
            stack: err.stack,
            code: err.code
        })
        res.status(500).json({
            success:false, 
            message:"Error creating checkout session",
            error: err.message
        })
    }
}

// Get user bookings
export const getUserBookings = async(req,res)=>{
    try {
        const bookings = await Booking.find({user: req.userId})
            .populate('doctor', 'name photo specialization')
            .sort({createdAt: -1})

        res.status(200).json({
            success: true,
            message: 'Bookings found',
            data: bookings
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error fetching bookings'
        })
    }
}

// Get doctor bookings
export const getDoctorBookings = async(req,res)=>{
    try {
        const doctor = await Doctor.findOne({user: req.userId})
        const bookings = await Booking.find({doctor: doctor._id})
            .populate('user', 'name photo')
            .sort({createdAt: -1})

        res.status(200).json({
            success: true,
            message: 'Bookings found',
            data: bookings
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error fetching bookings'
        })
    }
}

// Cancel booking
export const cancelBooking = async(req,res)=>{
    try {
        const booking = await Booking.findById(req.params.bookingId)
        
        if(!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            })
        }

        // Check if user is authorized to cancel
        if(booking.user.toString() !== req.userId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to cancel this booking'
            })
        }

        booking.status = 'cancelled'
        await booking.save()

        res.status(200).json({
            success: true,
            message: 'Booking cancelled successfully'
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error cancelling booking'
        })
    }
}

// Reschedule booking
export const rescheduleBooking = async(req,res)=>{
    try {
        const { newDate, newTime } = req.body
        const booking = await Booking.findById(req.params.bookingId)
        
        if(!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            })
        }

        // Check if user is authorized to reschedule
        if(booking.user.toString() !== req.userId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to reschedule this booking'
            })
        }

        booking.appointmentDate = newDate
        booking.appointmentTime = newTime
        booking.status = 'rescheduled'
        await booking.save()

        res.status(200).json({
            success: true,
            message: 'Booking rescheduled successfully'
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error rescheduling booking'
        })
    }
}

// Verify payment
export const verifyPayment = async(req,res)=>{
    try {
        const { sessionId } = req.params;
        
        if (!process.env.STRIPE_SECRET_KEY) {
            return res.status(200).json({
                success: true,
                message: "Payment verified (direct booking)"
            });
        }

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        
        // Retrieve the session
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        
        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Payment session not found"
            });
        }

        // Find the booking with this session ID
        const booking = await Booking.findOne({ session: sessionId });
        
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        // Update booking status based on payment status
        if (session.payment_status === 'paid') {
            booking.status = 'approved';
            booking.isPaid = true;
            await booking.save();
        }

        res.status(200).json({
            success: true,
            message: "Payment verified successfully",
            data: {
                booking,
                paymentStatus: session.payment_status
            }
        });
    } catch (err) {
        console.error('Payment verification error:', err);
        res.status(500).json({
            success: false,
            message: "Error verifying payment",
            error: err.message
        });
    }
}
