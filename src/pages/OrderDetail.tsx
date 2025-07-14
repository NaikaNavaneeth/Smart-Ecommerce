// src/pages/OrderDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const OrderDetail: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [orderItems, setOrderItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('order_id', orderId);

      if (error) {
        console.error('Error fetching order details:', error.message);
      } else {
        setOrderItems(data);
      }
    };

    if (orderId) fetchOrderDetails();
  }, [orderId]);

  if (orderItems.length === 0) return <p className="p-6">Loading order details...</p>;

  const order = orderItems[0];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Order #{orderId}</h1>

      <div className="bg-white rounded shadow p-4 space-y-2">
        <p><strong>Customer:</strong> {order.full_name}</p>
        <p><strong>Email:</strong> {order.email}</p>
        <p><strong>Mobile:</strong> {order.mobile_number}</p>
        <p><strong>Address:</strong> {order.address}, {order.city} - {order.pincode}</p>
        <p><strong>Payment:</strong> {order.payment_type} ({order.payment_status})</p>
        <p><strong>Status:</strong> {order.order_status}</p>
        <p><strong>Ordered on:</strong> {new Date(order.order_date).toLocaleString()}</p>

        <hr className="my-4" />

        <h2 className="text-lg font-semibold mb-3">Items</h2>
        <div className="space-y-4">
          {orderItems.map((item) => (
            <div
              key={item.product_id}
              className="flex items-center space-x-4 border-b pb-4"
            >
              <img
                src={item.product_image}
                alt={item.product_name}
                className="w-20 h-20 object-cover rounded border"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-800">{item.product_name}</p>
                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                <p className="text-sm text-gray-600">Price: ₹{item.price}</p>
              </div>
              <p className="font-semibold text-right text-gray-800">₹{item.total_amount}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
