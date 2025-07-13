import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home } from 'lucide-react';

const ReturnHomeButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show on home page
  if (location.pathname === '/' || location.pathname === '/home') {
    return null;
  }

  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => navigate('/')}
      className="fixed top-20 left-4 bg-white shadow-lg border border-gray-200 rounded-full p-3 hover:bg-gray-50 transition-colors z-40 flex items-center space-x-2"
    >
      <Home className="w-5 h-5 text-blue-600" />
      <span className="hidden md:block text-sm font-medium text-gray-700">Return to Home</span>
    </motion.button>
  );
};

export default ReturnHomeButton;