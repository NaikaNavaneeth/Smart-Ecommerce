import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CreditCard,
  Smartphone,
  Wallet,
  Truck,
  Check,
  Lock,
  MapPin
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { CheckoutForm } from '../types';
import { supabase } from '../lib/supabase';

const Checkout: React.FC = () => {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CheckoutForm>({
    name: '',
    mobile: '',
    email: '',
    address: '',
    city: '',
    pincode: '',
    paymentMode: 'cod'
  });
  const [errors, setErrors] = useState<Partial<CheckoutForm>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const subtotal = state.cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal > 499 ? 0 : 99;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  const validateForm = () => {
    const newErrors: Partial<CheckoutForm> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.mobile.trim()) newErrors.mobile = 'Mobile number is required';
    else if (!/^\d{10}$/.test(formData.mobile)) newErrors.mobile = 'Invalid mobile number';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'Invalid pincode';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof CheckoutForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateForm()) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    const orderId = `ORD${Date.now()}`;

    const orderInserts = state.cart.map((item) => ({
      order_id: orderId,
      user_id: state.user?.id,
      product_id: item.product.id,
      product_name: item.product.name,
      product_image: item.product.image_url || item.product.image_url,
      price: item.product.price,
      quantity: item.quantity,
      total_amount: item.product.price * item.quantity,
      payment_type: formData.paymentMode,
      payment_status: formData.paymentMode === 'cod' ? 'Pending' : 'Paid',
      order_status: 'Pending',
      full_name: formData.name,
      mobile_number: formData.mobile,
      email: formData.email,
      address: formData.address,
      city: formData.city,
      pincode: formData.pincode,
      notes: '',
      order_date: new Date().toISOString()
    }));

    const { error } = await supabase.from('orders').insert(orderInserts);

    if (error) {
      console.error('Order submission failed:', error.message);
      setIsProcessing(false);
      return;
    }

    for (const item of state.cart) {
      const newStock = item.product.stock_count - item.quantity;
      await supabase
        .from('products')
        .update({ stock_count: newStock })
        .eq('id', item.product.id);
    }

    dispatch({ type: 'CLEAR_CART' });
    navigate('/order-success', { state: { orderId } });
  };

  const steps = [
    { number: 1, title: 'Shipping Details', icon: MapPin },
    { number: 2, title: 'Payment Method', icon: CreditCard },
    { number: 3, title: 'Review Order', icon: Check }
  ];

  const paymentMethods = [
    { id: 'cod', name: 'Cash on Delivery', icon: Truck, description: 'Pay when you receive' },
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, description: 'Visa, Mastercard, RuPay' },
    { id: 'upi', name: 'UPI Payment', icon: Smartphone, description: 'PhonePe, GPay, Paytm' },
    { id: 'wallet', name: 'Digital Wallet', icon: Wallet, description: 'Amazon Pay, Paytm Wallet' }
  ];

  if (state.cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/cart')}
            className="mr-4 p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Checkout</h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center space-x-2 ${
                  currentStep >= step.number ? 'text-blue-600' : 'text-gray-400'
                }`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    currentStep >= step.number 
                      ? 'border-blue-600 bg-blue-600 text-white' 
                      : 'border-gray-300'
                  }`}>
                    {currentStep > step.number ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className="font-medium">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Shipping Details */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-lg p-6 shadow-sm"
                >
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Shipping Details</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your full name"
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        value={formData.mobile}
                        onChange={(e) => handleInputChange('mobile', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.mobile ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="10-digit mobile number"
                      />
                      {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your email"
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address *
                      </label>
                      <textarea
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        rows={3}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.address ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your complete address"
                      />
                      {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.city ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your city"
                      />
                      {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        value={formData.pincode}
                        onChange={(e) => handleInputChange('pincode', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.pincode ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="6-digit pincode"
                      />
                      {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Payment Method */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-lg p-6 shadow-sm"
                >
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Payment Method</h2>
                  
                  <div className="space-y-4">
                    {paymentMethods.map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          formData.paymentMode === method.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMode"
                          value={method.id}
                          checked={formData.paymentMode === method.id}
                          onChange={(e) => handleInputChange('paymentMode', e.target.value as any)}
                          className="sr-only"
                        />
                        <method.icon className="w-6 h-6 text-gray-600 mr-4" />
                        <div>
                          <div className="font-medium text-gray-800">{method.name}</div>
                          <div className="text-sm text-gray-600">{method.description}</div>
                        </div>
                        {formData.paymentMode === method.id && (
                          <Check className="w-5 h-5 text-blue-600 ml-auto" />
                        )}
                      </label>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Review Order */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Order Items */}
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Items</h2>
                    <div className="space-y-4">
                      {state.cart.map((item) => (
                        <div key={item.product.id} className="flex items-center space-x-4">
                          <img
                            src={item.product.image_url}
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-800">{item.product.name}</h3>
                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                          </div>
                          <span className="font-semibold">
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Details */}
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Shipping Details</h2>
                    <div className="text-gray-600">
                      <p className="font-medium">{formData.name}</p>
                      <p>{formData.mobile}</p>
                      <p>{formData.address}</p>
                      <p>{formData.city}, {formData.pincode}</p>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Method</h2>
                    <p className="text-gray-600">
                      {paymentMethods.find(m => m.id === formData.paymentMode)?.name}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
                className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              {currentStep < 3 ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNextStep}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Next
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Place Order</span>
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? 'Free' : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (GST)</span>
                  <span className="font-medium">{formatPrice(tax)}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-bold text-blue-600">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center space-x-2 text-sm text-green-800">
                  <Lock className="w-4 h-4" />
                  <span>Secure checkout with 256-bit SSL encryption</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;