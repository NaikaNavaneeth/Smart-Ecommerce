import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, Smartphone, ShoppingCart, Scan, CheckCircle, X } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface CartSyncProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartSync: React.FC<CartSyncProps> = ({ isOpen, onClose }) => {
  const { state } = useApp();
  const [scanMode, setScanMode] = useState<'qr' | 'product' | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);

  const simulateScan = async (type: 'qr' | 'product') => {
    setIsScanning(true);
    
    // Simulate scanning delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (type === 'qr') {
      setScanResult('Cart synced successfully! 3 items added from in-store shopping.');
    } else {
      setScanResult('Product scanned! Nike Air Force 1 added to your cart.');
    }
    
    setIsScanning(false);
  };

  const cartTotal = state.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Omni-Channel Cart Sync</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {!scanMode && !scanResult && (
                <div className="space-y-6">
                  <div className="text-center">
                    <ShoppingCart className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      Sync Your Shopping Experience
                    </h3>
                    <p className="text-gray-600">
                      Seamlessly connect your in-store and online shopping carts
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setScanMode('qr')}
                      className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-center"
                    >
                      <QrCode className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                      <h4 className="font-semibold text-gray-800 mb-2">Sync Cart with QR</h4>
                      <p className="text-sm text-gray-600">
                        Scan QR code from in-store device to sync your cart
                      </p>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setScanMode('product')}
                      className="p-6 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all text-center"
                    >
                      <Scan className="w-12 h-12 text-green-600 mx-auto mb-3" />
                      <h4 className="font-semibold text-gray-800 mb-2">Scan Product</h4>
                      <p className="text-sm text-gray-600">
                        Add in-store products to your online cart by scanning
                      </p>
                    </motion.button>
                  </div>

                  {/* Current Cart Summary */}
                  {state.cart.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-3">Current Online Cart</h4>
                      <div className="space-y-2">
                        {state.cart.slice(0, 3).map((item) => (
                          <div key={item.product.id} className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">
                              {item.product.name} x{item.quantity}
                            </span>
                            <span className="font-medium">
                              ₹{(item.product.price * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        ))}
                        {state.cart.length > 3 && (
                          <div className="text-sm text-gray-500">
                            +{state.cart.length - 3} more items
                          </div>
                        )}
                        <div className="border-t pt-2 flex justify-between items-center font-semibold">
                          <span>Total:</span>
                          <span>₹{cartTotal.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {scanMode && !scanResult && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="relative">
                      <div className="w-64 h-64 mx-auto bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                        {isScanning ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1 }}
                            className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full"
                          />
                        ) : (
                          <div className="text-center">
                            {scanMode === 'qr' ? (
                              <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                            ) : (
                              <Scan className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                            )}
                            <p className="text-gray-500">
                              {scanMode === 'qr' ? 'Position QR code here' : 'Position product barcode here'}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {/* Scanning overlay */}
                      {!isScanning && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-48 h-48 border-2 border-blue-500 rounded-lg">
                            <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-500"></div>
                            <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-500"></div>
                            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-500"></div>
                            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-500"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {scanMode === 'qr' ? 'Scan QR Code' : 'Scan Product'}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {isScanning 
                        ? 'Processing...' 
                        : scanMode === 'qr' 
                          ? 'Point your camera at the QR code displayed on the in-store device'
                          : 'Point your camera at the product barcode'
                      }
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => simulateScan(scanMode)}
                        disabled={isScanning}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                      >
                        <Smartphone className="w-4 h-4" />
                        <span>{isScanning ? 'Scanning...' : 'Start Scan'}</span>
                      </motion.button>

                      <button
                        onClick={() => setScanMode(null)}
                        className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {scanResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center space-y-6"
                >
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
                  <h3 className="text-xl font-semibold text-gray-800">Success!</h3>
                  <p className="text-gray-600">{scanResult}</p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => {
                        setScanResult(null);
                        setScanMode(null);
                      }}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Scan Again
                    </button>
                    <button
                      onClick={onClose}
                      className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      View Cart
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartSync;