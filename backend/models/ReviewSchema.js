import mongoose from "mongoose";
import Doctor from "./DoctorSchema.js";

const ReviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctor: {
      type: mongoose.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    reviewText: {
      type: String,
      required: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Prevent duplicate reviews from the same user for the same doctor
ReviewSchema.index({ user: 1, doctor: 1 }, { unique: true });

ReviewSchema.pre(/^find/, function(next){
  this.populate({
    path:"user",
    select:"name photo",
  })
  next();
})

ReviewSchema.statics.calcAverageRatings = async function(doctorId){
  //this points the current review
  const stats = await this.aggregate([{
    $match:{doctor:doctorId}
  },
  {
    $group:{
      _id:'$doctor',
      numOfRating:{$sum:1},
      avgRating:{$avg:'$rating'}
    }
  }
])
await Doctor.findByIdAndUpdate(doctorId,{
  totalRating: stats[0].numOfRating,
  averageRating: stats[0].avgRating,
});
};

ReviewSchema.post('save', function(){
  this.constructor.calcAverageRatings(this.doctor)
})

export default mongoose.model("Review", ReviewSchema);
