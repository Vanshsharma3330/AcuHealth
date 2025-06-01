import Review from '../models/ReviewSchema.js'
import Doctor from '../models/DoctorSchema.js'

// Get all reviews 
export const getAllReviews = async(req,res)=>{
    try {
        const reviews = await Review.find({})
            .populate('user', 'name photo')
            .populate('doctor', 'name photo')
        res.status(200).json({success:true, message:'Successful', data:reviews})
    } catch (err) { 
        res.status(404).json({success:false, message:'Not Found'})
    }
}

// Create Review
export const createReview = async(req,res)=>{
    if (!req.body.doctor) req.body.doctor = req.params.doctorId;
    if (!req.body.user) req.body.user = req.userId;

    // Validate rating
    if (!req.body.rating || req.body.rating < 1 || req.body.rating > 5) {
        return res.status(400).json({
            success: false,
            message: 'Rating must be between 1 and 5'
        });
    }

    // Check if user has already reviewed this doctor
    const existingReview = await Review.findOne({
        user: req.userId,
        doctor: req.body.doctor
    });

    if (existingReview) {
        return res.status(400).json({
            success: false,
            message: 'You have already reviewed this doctor'
        });
    }

    const newReview = new Review(req.body);
    try {
        const savedReview = await newReview.save();
        
        // Update doctor's average rating
        const doctor = await Doctor.findById(req.body.doctor);
        const reviews = await Review.find({ doctor: req.body.doctor });
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        doctor.averageRating = totalRating / reviews.length;
        await doctor.save();

        await Doctor.findByIdAndUpdate(req.body.doctor,{
            $push:{reviews: savedReview._id}
        })

        res.status(200).json({success:true, message:'Review Submitted', data:savedReview});
    } catch (err) {
        res.status(500).json({success:false, message:err.message});
    }
}

// Update Review
export const updateReview = async(req,res)=>{
    try {
        const review = await Review.findById(req.params.id);
        
        if(!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        // Check if user is authorized to update
        if(review.user.toString() !== req.userId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this review'
            });
        }

        const updatedReview = await Review.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        // Update doctor's average rating
        const doctor = await Doctor.findById(review.doctor);
        const reviews = await Review.find({ doctor: review.doctor });
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        doctor.averageRating = totalRating / reviews.length;
        await doctor.save();

        res.status(200).json({
            success: true,
            message: 'Review updated successfully',
            data: updatedReview
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error updating review'
        });
    }
}

// Delete Review
export const deleteReview = async(req,res)=>{
    try {
        const review = await Review.findById(req.params.id);
        
        if(!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        // Check if user is authorized to delete
        if(review.user.toString() !== req.userId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this review'
            });
        }

        await Review.findByIdAndDelete(req.params.id);

        // Update doctor's average rating
        const doctor = await Doctor.findById(review.doctor);
        const reviews = await Review.find({ doctor: review.doctor });
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        doctor.averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
        await doctor.save();

        res.status(200).json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error deleting review'
        });
    }
}
