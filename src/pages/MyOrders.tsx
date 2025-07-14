// src/pages/MyOrders.tsx
import React, { useEffect, useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const MyOrders: React.FC = () => {
  const { state } = useApp();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', state.user?.id)
        .order('order_date', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error.message);
      } else {
        setOrders(data);
      }
    };

    if (state.user) fetchOrders();
  }, [state.user]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <p className="text-gray-600">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.order_id}
              onClick={() => navigate(`/order/${order.order_id}`)}
              className="p-4 bg-white shadow hover:shadow-md rounded cursor-pointer border border-gray-200 transition"
            >
              <h2 className="font-semibold">Order #{order.order_id}</h2>
              <p>{order.product_name} (x{order.quantity})</p>
              <p className="text-gray-600 text-sm">{new Date(order.order_date).toLocaleString()}</p>
              <p className="text-sm font-medium text-blue-600">Status: {order.order_status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
