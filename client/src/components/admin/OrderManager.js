import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import LoadingSpinner from '../LoadingSpinner';

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [pagination, setPagination] = useState({});

  const statusOptions = [
    { value: '', label: 'All Orders' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Confirmed', label: 'Confirmed' },
    { value: 'Shipped', label: 'Shipped' },
    { value: 'Delivered', label: 'Delivered' },
    { value: 'Cancelled', label: 'Cancelled' }
  ];

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const password = sessionStorage.getItem('adminPassword');
      const params = { page: 1, limit: 20 };
      if (selectedStatus) {
        params.status = selectedStatus;
      }

      const response = await adminAPI.getOrders(password, params);
      setOrders(response.data.orders);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        total: response.data.total
      });
    } catch (err) {
      setError('Failed to load orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus, notes = '') => {
    try {
      const password = sessionStorage.getItem('adminPassword');
      await adminAPI.updateOrderStatus(orderId, password, newStatus, notes);
      
      // Update the order in the local state
      setOrders(orders.map(order => 
        order._id === orderId 
          ? { ...order, status: newStatus, notes }
          : order
      ));
    } catch (err) {
      alert('Failed to update order status');
      console.error('Error updating order:', err);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Confirmed': 'bg-blue-100 text-blue-800',
      'Shipped': 'bg-purple-100 text-purple-800',
      'Delivered': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
          <p className="text-gray-600">
            {pagination.total} total orders
            {selectedStatus && ` • Filtered by: ${selectedStatus}`}
          </p>
        </div>
        
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <OrderCard
            key={order._id}
            order={order}
            onStatusUpdate={handleStatusUpdate}
            getStatusColor={getStatusColor}
          />
        ))}
      </div>

      {orders.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-600">
            {selectedStatus ? `No ${selectedStatus.toLowerCase()} orders found` : 'No orders found'}
          </p>
        </div>
      )}
    </div>
  );
};

const OrderCard = ({ order, onStatusUpdate, getStatusColor }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [updating, setUpdating] = useState(false);

  const handleQuickStatusUpdate = async (newStatus) => {
    setUpdating(true);
    await onStatusUpdate(order._id, newStatus);
    setUpdating(false);
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                Order #{order._id.slice(-8)}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Customer</p>
                <p className="font-medium">{order.customerName}</p>
                <p className="text-gray-500">{order.email}</p>
              </div>
              
              <div>
                <p className="text-gray-600">Product</p>
                <p className="font-medium">{order.productId?.name}</p>
                <p className="text-gray-500">Size: {order.size}</p>
              </div>
              
              <div>
                <p className="text-gray-600">Order Date</p>
                <p className="font-medium">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p className="text-gray-500">
                  {new Date(order.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="ml-4 text-gray-500 hover:text-gray-700"
          >
            <svg
              className={`w-5 h-5 transform transition-transform ${showDetails ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 mb-4">
          {order.status === 'Pending' && (
            <button
              onClick={() => handleQuickStatusUpdate('Confirmed')}
              disabled={updating}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              Confirm
            </button>
          )}
          
          {order.status === 'Confirmed' && (
            <button
              onClick={() => handleQuickStatusUpdate('Shipped')}
              disabled={updating}
              className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition-colors disabled:bg-gray-400"
            >
              Mark as Shipped
            </button>
          )}
          
          {order.status === 'Shipped' && (
            <button
              onClick={() => handleQuickStatusUpdate('Delivered')}
              disabled={updating}
              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors disabled:bg-gray-400"
            >
              Mark as Delivered
            </button>
          )}
          
          {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
            <button
              onClick={() => handleQuickStatusUpdate('Cancelled')}
              disabled={updating}
              className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors disabled:bg-gray-400"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Expanded Details */}
        {showDetails && (
          <div className="border-t pt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Contact Information</h4>
                <p className="text-sm text-gray-600">Phone: {order.phone}</p>
                <p className="text-sm text-gray-600">Payment: {order.paymentMethod}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Delivery Address</h4>
                <p className="text-sm text-gray-600">{order.address}</p>
              </div>
            </div>

            {order.productId && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Product Details</h4>
                <div className="flex items-center space-x-4">
                  <img
                    src={order.productId.imageUrl}
                    alt={order.productId.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium">{order.productId.name}</p>
                    <p className="text-sm text-gray-600">${order.productId.price}</p>
                    <p className="text-sm text-gray-600">Category: {order.productId.category}</p>
                  </div>
                </div>
              </div>
            )}

            {order.notes && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Notes</h4>
                <p className="text-sm text-gray-600">{order.notes}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManager;
