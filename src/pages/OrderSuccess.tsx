import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, Truck, Home, Download } from 'lucide-react';

const OrderSuccess: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId || 'ORD' + Date.now();

  useEffect(() => {
    // Confetti animation or celebration effect can be added here
    const timer = setTimeout(() => {
      // Auto redirect after 10 seconds
      // navigate('/');
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-lg p-8 text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-12 h-12 text-green-600" />
          </motion.div>

          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Order Placed Successfully! 🎉
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              Thank you for shopping with SmartShop+
            </p>
            <p className="text-gray-500 mb-8">
              Your order <span className="font-semibold text-blue-600">#{orderId}</span> has been confirmed
            </p>
          </motion.div>

          {/* Order Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-50 rounded-lg p-6 mb-8"
          >
            <h3 className="font-semibold text-gray-800 mb-4">What happens next?</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-800">Order Confirmed</p>
                  <p className="text-sm text-gray-600">We've received your order</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Package className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-800">Processing</p>
                  <p className="text-sm text-gray-600">We're preparing your items</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Truck className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-800">Shipped</p>
                  <p className="text-sm text-gray-600">Your order is on the way</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <Home className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-800">Delivered</p>
                  <p className="text-sm text-gray-600">Enjoy your purchase!</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Estimated Delivery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8"
          >
            <div className="flex items-center justify-center space-x-2 text-blue-800">
              <Truck className="w-5 h-5" />
              <span className="font-medium">
                Estimated delivery: {new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Home className="w-4 h-4" />
              <span>Continue Shopping</span>
            </button>
            
            <button className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Download Invoice</span>
            </button>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-600"
          >
            <p>Need help? Contact us at <span className="text-blue-600">support@smartshopplus.com</span></p>
            <p>or call <span className="text-blue-600">1800-123-4567</span></p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderSuccess;