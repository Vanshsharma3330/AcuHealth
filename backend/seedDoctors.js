import mongoose from 'mongoose';
import Doctor from './models/DoctorSchema.js';
import dotenv from 'dotenv';

dotenv.config();

const sampleDoctors = [
  {
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@example.com",
    password: "$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iqDp0.7QzJQeC", // hashed "password123"
    photo: "https://img.freepik.com/free-photo/portrait-smiling-female-doctor_171337-1532.jpg",
    phone: 1234567890,
    ticketPrice: 1500,
    role: "doctor",
    specialization: "Cardiology",
    qualifications: [
      {
        degree: "MBBS",
        university: "Harvard Medical School",
        startingDate: "2010-01-01",
        endingDate: "2014-12-31"
      },
      {
        degree: "MD",
        university: "Johns Hopkins University",
        startingDate: "2015-01-01",
        endingDate: "2018-12-31"
      }
    ],
    experiences: [
      {
        position: "Senior Cardiologist",
        hospital: "City General Hospital",
        startingDate: "2019-01-01",
        endingDate: "2023-12-31"
      }
    ],
    bio: "Expert cardiologist",
    about: "Dr. Sarah Johnson is a board-certified cardiologist with over 10 years of experience in treating various heart conditions. She specializes in preventive cardiology and has helped numerous patients maintain heart health.",
    timeSlots: [
      {
        day: "monday",
        startingTime: "09:00",
        endingTime: "17:00"
      },
      {
        day: "wednesday",
        startingTime: "09:00",
        endingTime: "17:00"
      },
      {
        day: "friday",
        startingTime: "09:00",
        endingTime: "17:00"
      }
    ],
    isApproved: "approved"
  },
  {
    name: "Dr. Michael Chen",
    email: "michael.chen@example.com",
    password: "$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iqDp0.7QzJQeC",
    photo: "https://img.freepik.com/free-photo/portrait-doctor_144627-39399.jpg",
    phone: 2345678901,
    ticketPrice: 2000,
    role: "doctor",
    specialization: "Neurology",
    qualifications: [
      {
        degree: "MBBS",
        university: "Stanford University",
        startingDate: "2012-01-01",
        endingDate: "2016-12-31"
      },
      {
        degree: "MD",
        university: "Yale University",
        startingDate: "2017-01-01",
        endingDate: "2020-12-31"
      }
    ],
    experiences: [
      {
        position: "Neurologist",
        hospital: "Central Medical Center",
        startingDate: "2021-01-01",
        endingDate: "2023-12-31"
      }
    ],
    bio: "Neurology specialist",
    about: "Dr. Michael Chen is a dedicated neurologist with extensive experience in treating complex neurological disorders. His research in brain mapping has contributed significantly to the field.",
    timeSlots: [
      {
        day: "tuesday",
        startingTime: "10:00",
        endingTime: "18:00"
      },
      {
        day: "thursday",
        startingTime: "10:00",
        endingTime: "18:00"
      },
      {
        day: "saturday",
        startingTime: "10:00",
        endingTime: "14:00"
      }
    ],
    isApproved: "approved"
  },
  {
    name: "Dr. Emily Brown",
    email: "emily.brown@example.com",
    password: "$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iqDp0.7QzJQeC",
    photo: "https://img.freepik.com/free-photo/young-female-doctor-with-stethoscope_1303-21199.jpg",
    phone: 3456789012,
    ticketPrice: 1800,
    role: "doctor",
    specialization: "Pediatrics",
    qualifications: [
      {
        degree: "MBBS",
        university: "University of California",
        startingDate: "2013-01-01",
        endingDate: "2017-12-31"
      },
      {
        degree: "MD",
        university: "Boston University",
        startingDate: "2018-01-01",
        endingDate: "2021-12-31"
      }
    ],
    experiences: [
      {
        position: "Pediatrician",
        hospital: "Children's Hospital",
        startingDate: "2022-01-01",
        endingDate: "2023-12-31"
      }
    ],
    bio: "Pediatric care expert",
    about: "Dr. Emily Brown is a compassionate pediatrician with a special interest in child development and preventive care. She has been working with children for over 5 years and is known for her gentle approach.",
    timeSlots: [
      {
        day: "monday",
        startingTime: "08:00",
        endingTime: "16:00"
      },
      {
        day: "wednesday",
        startingTime: "08:00",
        endingTime: "16:00"
      },
      {
        day: "friday",
        startingTime: "08:00",
        endingTime: "16:00"
      }
    ],
    isApproved: "approved"
  },
  {
    name: "Dr. James Wilson",
    email: "james.wilson@example.com",
    password: "$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iqDp0.7QzJQeC",
    photo: "https://img.freepik.com/free-photo/doctor-with-stethoscope-hands-hospital-background_1423-1.jpg",
    phone: 4567890123,
    ticketPrice: 2200,
    role: "doctor",
    specialization: "Orthopedics",
    qualifications: [
      {
        degree: "MBBS",
        university: "Duke University",
        startingDate: "2011-01-01",
        endingDate: "2015-12-31"
      },
      {
        degree: "MD",
        university: "Columbia University",
        startingDate: "2016-01-01",
        endingDate: "2019-12-31"
      }
    ],
    experiences: [
      {
        position: "Orthopedic Surgeon",
        hospital: "Sports Medicine Center",
        startingDate: "2020-01-01",
        endingDate: "2023-12-31"
      }
    ],
    bio: "Orthopedic specialist",
    about: "Dr. James Wilson is a skilled orthopedic surgeon specializing in sports injuries and joint replacements. He has successfully performed over 1000 surgeries and is known for his innovative treatment approaches.",
    timeSlots: [
      {
        day: "monday",
        startingTime: "09:00",
        endingTime: "17:00"
      },
      {
        day: "wednesday",
        startingTime: "09:00",
        endingTime: "17:00"
      },
      {
        day: "friday",
        startingTime: "09:00",
        endingTime: "17:00"
      }
    ],
    isApproved: "approved"
  },
  {
    name: "Dr. Lisa Patel",
    email: "lisa.patel@example.com",
    password: "$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iqDp0.7QzJQeC",
    photo: "https://img.freepik.com/free-photo/woman-doctor-wearing-lab-coat-with-stethoscope-isolated_1303-29791.jpg",
    phone: 5678901234,
    ticketPrice: 1900,
    role: "doctor",
    specialization: "Dermatology",
    qualifications: [
      {
        degree: "MBBS",
        university: "University of Pennsylvania",
        startingDate: "2014-01-01",
        endingDate: "2018-12-31"
      },
      {
        degree: "MD",
        university: "Northwestern University",
        startingDate: "2019-01-01",
        endingDate: "2022-12-31"
      }
    ],
    experiences: [
      {
        position: "Dermatologist",
        hospital: "Skin Care Clinic",
        startingDate: "2023-01-01",
        endingDate: "2023-12-31"
      }
    ],
    bio: "Dermatology expert",
    about: "Dr. Lisa Patel is a board-certified dermatologist specializing in cosmetic and medical dermatology. She has extensive experience in treating various skin conditions and performing aesthetic procedures.",
    timeSlots: [
      {
        day: "tuesday",
        startingTime: "09:00",
        endingTime: "17:00"
      },
      {
        day: "thursday",
        startingTime: "09:00",
        endingTime: "17:00"
      },
      {
        day: "saturday",
        startingTime: "09:00",
        endingTime: "13:00"
      }
    ],
    isApproved: "approved"
  },
  {
    name: "Dr. Robert Kim",
    email: "robert.kim@example.com",
    password: "$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iqDp0.7QzJQeC",
    photo: "https://img.freepik.com/free-photo/doctor-with-his-arms-crossed-white-background_1368-5790.jpg",
    phone: 6789012345,
    ticketPrice: 2100,
    role: "doctor",
    specialization: "Ophthalmology",
    qualifications: [
      {
        degree: "MBBS",
        university: "University of Michigan",
        startingDate: "2012-01-01",
        endingDate: "2016-12-31"
      },
      {
        degree: "MD",
        university: "University of California, San Francisco",
        startingDate: "2017-01-01",
        endingDate: "2020-12-31"
      }
    ],
    experiences: [
      {
        position: "Ophthalmologist",
        hospital: "Eye Care Center",
        startingDate: "2021-01-01",
        endingDate: "2023-12-31"
      }
    ],
    bio: "Eye care specialist",
    about: "Dr. Robert Kim is a skilled ophthalmologist with expertise in cataract surgery and retinal disorders. He is known for his precision in surgical procedures and patient-centered approach to eye care.",
    timeSlots: [
      {
        day: "monday",
        startingTime: "08:00",
        endingTime: "16:00"
      },
      {
        day: "wednesday",
        startingTime: "08:00",
        endingTime: "16:00"
      },
      {
        day: "friday",
        startingTime: "08:00",
        endingTime: "16:00"
      }
    ],
    isApproved: "approved"
  }
];

const seedDoctors = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    // Clear existing doctors
    await Doctor.deleteMany({});
    console.log('Cleared existing doctors');

    // Insert sample doctors
    await Doctor.insertMany(sampleDoctors);
    console.log('Sample doctors added successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding doctors:', error);
    process.exit(1);
  }
};

seedDoctors(); 