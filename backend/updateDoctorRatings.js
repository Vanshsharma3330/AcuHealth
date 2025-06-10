import mongoose from 'mongoose';
import Doctor from './models/DoctorSchema.js';
import dotenv from 'dotenv';

dotenv.config();

const updateDoctorRatings = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    // Update each doctor with realistic ratings
    const doctors = await Doctor.find({});
    
    for (const doctor of doctors) {
      // Generate a realistic rating between 4.0 and 5.0
      const rating = (4 + Math.random()).toFixed(1);
      const totalRatings = Math.floor(Math.random() * 50) + 20; // Between 20-70 ratings
      
      await Doctor.findByIdAndUpdate(doctor._id, {
        averageRating: parseFloat(rating),
        totalRating: totalRatings
      });
      
      console.log(`Updated ${doctor.name} with rating ${rating} (${totalRatings} reviews)`);
    }

    console.log('All doctor ratings updated successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error updating doctor ratings:', error);
    process.exit(1);
  }
};

updateDoctorRatings(); 