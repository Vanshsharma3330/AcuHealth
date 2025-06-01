import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BASE_URL } from '../../config';
import Loader from '../../components/Loader/Loading';
import Error from '../../components/Error/Error';
import { FaCalendarCheck, FaUsers, FaStar, FaClock } from 'react-icons/fa';

const DashboardStats = () => {
  const { data, loading, error } = useQuery({
    queryKey: ['doctorStats'],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/api/v1/doctor-dashboard/stats`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return res.json();
    },
  });

  if (loading) return <Loader />;
  if (error) return <Error />;

  const stats = data?.data;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Total Appointments</p>
            <h3 className="text-2xl font-bold mt-2">{stats?.totalAppointments}</h3>
          </div>
          <FaCalendarCheck className="text-4xl text-blue-500" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Today's Appointments</p>
            <h3 className="text-2xl font-bold mt-2">{stats?.todayAppointments?.length}</h3>
          </div>
          <FaClock className="text-4xl text-green-500" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Total Patients</p>
            <h3 className="text-2xl font-bold mt-2">{stats?.totalPatients}</h3>
          </div>
          <FaUsers className="text-4xl text-purple-500" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Average Rating</p>
            <h3 className="text-2xl font-bold mt-2">{stats?.averageRating?.toFixed(1)}</h3>
          </div>
          <FaStar className="text-4xl text-yellow-500" />
        </div>
      </div>
    </div>
  );
};

export default DashboardStats; 