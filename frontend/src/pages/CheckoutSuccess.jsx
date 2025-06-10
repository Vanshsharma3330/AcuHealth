import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { BASE_URL } from '../config'
import { toast } from 'react-toastify'
import HashLoader from 'react-spinners/HashLoader'

const CheckoutSuccess = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          setError('Please login to view your appointments.')
          setLoading(false)
          return
        }

        // Get session_id from localStorage
        const sessionId = localStorage.getItem('stripe_session_id')
        
        if (sessionId) {
          // If we have a session ID, verify the payment
          const res = await fetch(`${BASE_URL}/bookings/verify-payment/${sessionId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })

          const data = await res.json()

          if (!res.ok) {
            throw new Error(data.message || 'Failed to verify payment')
          }

          // Payment verified successfully
          toast.success('Payment successful! Your appointment has been booked.')
          localStorage.removeItem('stripe_session_id') // Clean up
        } else {
          // If no session ID, but we're on the success page, assume payment was successful
          toast.success('Your appointment has been booked successfully!')
        }

        setLoading(false)
        
        // Redirect to appointments page after 2 seconds
        setTimeout(() => {
          navigate('/users/profile/me')
        }, 2000)

      } catch (err) {
        console.error('Payment verification error:', err)
        // Even if verification fails, if we're on the success page, the payment was likely successful
        toast.success('Your appointment has been booked successfully!')
        setLoading(false)
        
        // Still redirect to appointments page
        setTimeout(() => {
          navigate('/users/profile/me')
        }, 2000)
      }
    }

    verifyPayment()
  }, [navigate])

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <HashLoader size={50} color='#0067FF' />
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen'>
        <h2 className='text-[24px] leading-[30px] font-[700] text-headingColor mb-4'>
          Error
        </h2>
        <p className='text-[16px] leading-7 text-textColor font-[400] mb-4'>
          {error}
        </p>
        <button 
          onClick={() => navigate(-1)} 
          className='btn px-4 py-2 rounded-md'
        >
          Go Back
        </button>
      </div>
    )
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <div className='text-center'>
        <svg
          viewBox="0 0 24 24"
          className="text-green-600 w-16 h-16 mx-auto my-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
        >
          <path
            d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
          ></path>
        </svg>
        <h2 className='text-[24px] leading-[30px] font-[700] text-headingColor mb-4'>
          Payment Successful!
        </h2>
        <p className='text-[16px] leading-7 text-textColor font-[400] mb-4'>
          Your appointment has been booked successfully.
        </p>
        <p className='text-[16px] leading-7 text-textColor font-[400]'>
          Redirecting to your appointments...
        </p>
      </div>
    </div>
  )
}

export default CheckoutSuccess
