import React from 'react'
import { FaUserMd, FaCalendarCheck, FaUsers, FaCog, FaMoneyBillWave, FaChartBar } from 'react-icons/fa'
import {useContext} from 'react'
import { BiMenu } from 'react-icons/bi'
import { authContext } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Tabs = ({tab, setTab}) => {

    const {dispatch} = useContext(authContext)
    const navigate = useNavigate()

    const handleLogout = () => {
        dispatch({type: 'LOGOUT'})
        navigate('/login')
    }
  return (
    <div>
      <span className='lg:hidden'>
        <BiMenu className='w-6 h-6 cursor-pointer' />
      </span>
      <div className='hidden lg:flex flex-col p-[30px] bg-white shadow-panelShadow items-center h-max rounded-md'>
        <div className='flex flex-col gap-4'>
          <button
            onClick={() => setTab('overview')}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
              tab === 'overview'
                ? 'bg-primaryColor text-white'
                : 'hover:bg-gray-100'
            }`}
          >
            <FaUserMd className='text-xl' />
            <span className='font-medium'>Overview</span>
          </button>

          <button
            onClick={() => setTab('appointments')}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
              tab === 'appointments'
                ? 'bg-primaryColor text-white'
                : 'hover:bg-gray-100'
            }`}
          >
            <FaCalendarCheck className='text-xl' />
            <span className='font-medium'>Appointments</span>
          </button>

          <button
            onClick={() => setTab('patients')}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
              tab === 'patients'
                ? 'bg-primaryColor text-white'
                : 'hover:bg-gray-100'
            }`}
          >
            <FaUsers className='text-xl' />
            <span className='font-medium'>Patients</span>
          </button>

          <button
            onClick={() => setTab('payments')}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
              tab === 'payments'
                ? 'bg-primaryColor text-white'
                : 'hover:bg-gray-100'
            }`}
          >
            <FaMoneyBillWave className='text-xl' />
            <span className='font-medium'>Payments</span>
          </button>

          <button
            onClick={() => setTab('analytics')}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
              tab === 'analytics'
                ? 'bg-primaryColor text-white'
                : 'hover:bg-gray-100'
            }`}
          >
            <FaChartBar className='text-xl' />
            <span className='font-medium'>Analytics</span>
          </button>

          <button
            onClick={() => setTab('settings')}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
              tab === 'settings'
                ? 'bg-primaryColor text-white'
                : 'hover:bg-gray-100'
            }`}
          >
            <FaCog className='text-xl' />
            <span className='font-medium'>Settings</span>
          </button>

          <div className='mt-[100px] w-full'>
            <button onClick={handleLogout} className='w-full bg-[#181A1E] p-3 text-[16px] text-white leading-7 rounded-md'>
                Logout
            </button>
            <button className='w-full bg-red-600 mt-4 text-white p-3 text-[16px] leading-7 rounded-md'>
                Delete Account
            </button>
          </div>  
        </div>
      </div>
    </div>
  )
}

export default Tabs
