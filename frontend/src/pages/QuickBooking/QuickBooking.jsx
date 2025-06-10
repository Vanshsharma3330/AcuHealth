import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../config';
import useFetchData from '../../hooks/useFetchData';
import Loader from '../../components/Loader/Loading';
import Error from '../../components/Error/Error';

const QuickBooking = () => {
  const navigate = useNavigate();
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');

  const { data: doctors, loading, error } = useFetchData(`${BASE_URL}/doctors`);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/bookings/checkout-session/${selectedDoctor}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          appointmentDate: selectedDate,
          appointmentTime: selectedTime,
          reason: reason
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message);
      }

      if (result.data.session) {
        // Open Stripe checkout in a new window
        const stripeWindow = window.open(result.data.session.url, '_blank');
        
        // Check if the window was opened successfully
        if (stripeWindow) {
          // Add event listener for when the window is closed
          const checkWindow = setInterval(() => {
            if (stripeWindow.closed) {
              clearInterval(checkWindow);
              // Redirect to success page in the main window with session ID
              window.location.href = `/checkout-success?session_id=${result.data.session.id}`;
            }
          }, 1000);
        } else {
          alert("Please allow popups for this website");
        }
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Failed to book appointment. Please try again.');
    }
  };

  if (loading) return <Loader />;
  if (error) return <Error />;

  return (
    <section className='bg-[#fff9ea]'>
      <div className='container'>
        <h2 className='heading text-center'>Quick Booking</h2>
        <p className='text__para text-center'>
          Book your appointment in just a few clicks
        </p>

        <div className='max-w-[600px] mx-auto mt-8'>
          <form onSubmit={handleSubmit} className='bg-white p-8 rounded-lg shadow-md'>
            <div className='mb-4'>
              <label className='block text-headingColor font-semibold mb-2'>
                Select Doctor
              </label>
              <select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                className='w-full p-3 border border-solid border-[#0066ff34] focus:outline-none focus:border-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor rounded-md'
                required
              >
                <option value=''>Select a doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    Dr. {doctor.name} - {doctor.specialization}
                  </option>
                ))}
              </select>
            </div>

            <div className='mb-4'>
              <label className='block text-headingColor font-semibold mb-2'>
                Select Date
              </label>
              <input
                type='date'
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className='w-full p-3 border border-solid border-[#0066ff34] focus:outline-none focus:border-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor rounded-md'
                required
              />
            </div>

            <div className='mb-4'>
              <label className='block text-headingColor font-semibold mb-2'>
                Select Time
              </label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className='w-full p-3 border border-solid border-[#0066ff34] focus:outline-none focus:border-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor rounded-md'
                required
              >
                <option value=''>Select a time</option>
                <option value='09:00'>09:00 AM</option>
                <option value='10:00'>10:00 AM</option>
                <option value='11:00'>11:00 AM</option>
                <option value='14:00'>02:00 PM</option>
                <option value='15:00'>03:00 PM</option>
                <option value='16:00'>04:00 PM</option>
              </select>
            </div>

            <div className='mb-4'>
              <label className='block text-headingColor font-semibold mb-2'>
                Reason for Visit
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className='w-full p-3 border border-solid border-[#0066ff34] focus:outline-none focus:border-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor rounded-md'
                rows='3'
                placeholder='Briefly describe your reason for visit'
              />
            </div>

            <button type='submit' className='btn w-full'>
              Book Appointment
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default QuickBooking; 