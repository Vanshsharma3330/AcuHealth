import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { FaMoneyBillWave, FaChartLine, FaCalendarAlt } from 'react-icons/fa';
import { BASE_URL } from '../../config';
import Loader from '../../components/Loader/Loading';
import Error from '../../components/Error/Error';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const PaymentAnalytics = () => {
  const [timeRange, setTimeRange] = useState('6months');

  const { data: payments, isLoading, error } = useQuery({
    queryKey: ['payments', timeRange],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/api/v1/payments/doctor/payments`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      return data.data;
    }
  });

  if (isLoading) return <Loader />;
  if (error) return <Error message={error.message} />;

  // Calculate statistics
  const totalRevenue = payments.reduce((sum, payment) => {
    return payment.status === 'completed' ? sum + payment.amount : sum;
  }, 0);

  const totalRefunds = payments.reduce((sum, payment) => {
    return payment.status === 'refunded' ? sum + payment.amount : sum;
  }, 0);

  const pendingPayments = payments.filter(payment => payment.status === 'pending').length;

  // Prepare data for charts
  const getMonthlyData = () => {
    const months = [];
    const startDate = startOfMonth(subMonths(new Date(), timeRange === '6months' ? 5 : 11));
    const endDate = endOfMonth(new Date());

    let currentDate = startDate;
    while (currentDate <= endDate) {
      const monthPayments = payments.filter(payment => {
        const paymentDate = new Date(payment.paymentDate);
        return (
          paymentDate >= startOfMonth(currentDate) &&
          paymentDate <= endOfMonth(currentDate)
        );
      });

      const revenue = monthPayments.reduce((sum, payment) => {
        return payment.status === 'completed' ? sum + payment.amount : sum;
      }, 0);

      months.push({
        month: format(currentDate, 'MMM yyyy'),
        revenue
      });

      currentDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
    }

    return months;
  };

  const getStatusDistribution = () => {
    const statusCount = payments.reduce((acc, payment) => {
      acc[payment.status] = (acc[payment.status] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(statusCount).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count
    }));
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Payment Analytics</h2>
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded ${
              timeRange === '6months'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200'
            }`}
            onClick={() => setTimeRange('6months')}
          >
            6 Months
          </button>
          <button
            className={`px-4 py-2 rounded ${
              timeRange === '12months'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200'
            }`}
            onClick={() => setTimeRange('12months')}
          >
            12 Months
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-2 mb-2">
            <FaMoneyBillWave className="text-green-500" />
            <h3 className="font-semibold">Total Revenue</h3>
          </div>
          <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-2 mb-2">
            <FaChartLine className="text-red-500" />
            <h3 className="font-semibold">Total Refunds</h3>
          </div>
          <p className="text-2xl font-bold">${totalRefunds.toFixed(2)}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-2 mb-2">
            <FaCalendarAlt className="text-yellow-500" />
            <h3 className="font-semibold">Pending Payments</h3>
          </div>
          <p className="text-2xl font-bold">{pendingPayments}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-4">Revenue Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getMonthlyData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8884d8"
                  name="Revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-4">Payment Status Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={getStatusDistribution()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {getStatusDistribution().map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentAnalytics; 