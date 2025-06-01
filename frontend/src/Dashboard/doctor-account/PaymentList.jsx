import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BASE_URL } from '../../config';
import Loader from '../../components/Loader/Loading';
import Error from '../../components/Error/Error';
import { format } from 'date-fns';
import { FaDownload, FaUndo } from 'react-icons/fa';

const PaymentList = () => {
  const [filter, setFilter] = useState('all');
  const queryClient = useQueryClient();

  const { data, loading, error } = useQuery({
    queryKey: ['doctorPayments'],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/api/v1/payments/doctor/payments`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return res.json();
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ paymentId, status, refundReason }) => {
      const res = await fetch(`${BASE_URL}/api/v1/payments/${paymentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ status, refundReason }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['doctorPayments']);
    },
  });

  if (loading) return <Loader />;
  if (error) return <Error />;

  const payments = data?.data || [];

  const filteredPayments = payments.filter(payment => {
    if (filter === 'all') return true;
    return payment.status === filter;
  });

  const handleRefund = (paymentId) => {
    const refundReason = window.prompt('Please enter refund reason:');
    if (refundReason) {
      updateStatusMutation.mutate({ 
        paymentId, 
        status: 'refunded',
        refundReason 
      });
    }
  };

  const downloadReceipt = (receiptUrl) => {
    window.open(receiptUrl, '_blank');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Payments</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-md px-4 py-2"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patient
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPayments.map((payment) => (
              <tr key={payment._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={payment.user?.photo || 'default-avatar.png'}
                        alt=""
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {payment.user?.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {payment.transactionId}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    ${payment.amount}
                  </div>
                  <div className="text-sm text-gray-500">
                    {payment.paymentMethod}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {format(new Date(payment.paymentDate), 'MMM dd, yyyy')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      payment.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : payment.status === 'failed'
                        ? 'bg-red-100 text-red-800'
                        : payment.status === 'refunded'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {payment.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    {payment.status === 'completed' && (
                      <>
                        <button
                          onClick={() => downloadReceipt(payment.receipt)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Download Receipt"
                        >
                          <FaDownload />
                        </button>
                        <button
                          onClick={() => handleRefund(payment._id)}
                          className="text-yellow-600 hover:text-yellow-900"
                          title="Refund Payment"
                        >
                          <FaUndo />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentList; 