import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  Globe, 
  ChevronDown,
  MapPin,
  Mic,
  X,
  Heart,
  LogOut,
  Settings,
  Package
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import VoiceSearch from './VoiceSearch';
import toast from 'react-hot-toast';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
  { code: 'bn', name: 'বাংলা', flag: '🇮🇳' }
];

const categories = [
  'Electronics',
  'Clothing', 
  'Footwear',
  'Groceries',
  'Home Appliances',
  'Furniture',
  'Books & Stationery',
  'Fitness & Sports',
  'Kids & Toys',
  'Beauty & Wellness'
];

const Navbar: React.FC = () => {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const currentLanguage = languages.find(lang => lang.code === state.language) || languages[0];
  const cartItemCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = state.wishlist.length;

  const handleLanguageChange = (languageCode: string) => {
    dispatch({ type: 'SET_LANGUAGE', payload: languageCode });
    setIsLanguageOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (state.searchQuery.trim()) {
      dispatch({ type: 'ADD_RECENT_SEARCH', payload: state.searchQuery.trim() });
      navigate(`/search?q=${encodeURIComponent(state.searchQuery)}`);
    }
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  const handleCategoryClick = (category: string) => {
    dispatch({ type: 'ADD_USER_INTEREST', payload: category });
    navigate(`/category/${category.toLowerCase().replace(/\s+/g, '-')}`);
  };

  const handleLogoClick = () => {
    navigate('/');
    dispatch({ type: 'SET_SEARCH_QUERY', payload: '' });
  };

  const handleLogout = () => {
    dispatch({ type: 'SET_USER', payload: null });
    toast.success('Logged out successfully');
    setIsUserMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-blue-600 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>Deliver to Mumbai 400001</span>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <span>Free shipping on orders over ₹499</span>
            <div className="relative">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center space-x-1 hover:bg-blue-700 px-2 py-1 rounded"
              >
                <Globe className="w-4 h-4" />
                <span>{currentLanguage.flag} {currentLanguage.name}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              
              <AnimatePresence>
                {isLanguageOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className="w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={handleLogoClick}
            className="flex items-center space-x-2"
          >
            <div className="bg-blue-600 text-white px-3 py-2 rounded-lg font-bold text-xl">
              S+
            </div>
            <span className="text-2xl font-bold text-gray-800">SmartShop+</span>
          </motion.button>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <div className="flex">
                <input
                  type="text"
                  value={state.searchQuery}
                  onChange={handleSearchChange}
                  placeholder={state.language === 'hi' ? 'खोजें...' : 'Search everything at SmartShop+'}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-l-full focus:outline-none focus:border-blue-500 text-lg"
                />
                <VoiceSearch />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-yellow-400 hover:bg-yellow-500 px-6 py-3 rounded-r-full transition-colors"
                >
                  <Search className="w-6 h-6 text-gray-800" />
                </motion.button>
              </div>
            </form>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {state.user ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
                >
                  <img
                    src={state.user.avatar}
                    alt={state.user.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="hidden md:block text-sm font-medium">{state.user.name}</span>
                  <ChevronDown className="w-4 h-4" />
                </motion.button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
                    >
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="font-medium text-gray-800">{state.user.name}</p>
                        <p className="text-sm text-gray-600">{state.user.email}</p>
                      </div>
                      <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                        <Package className="w-4 h-4" />
                        <span>My Orders</span>
                      </button>
                      <button 
                        onClick={() => {
                          navigate('/wishlist');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <Heart className="w-4 h-4" />
                        <span>Wishlist ({wishlistCount})</span>
                      </button>
                      <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </button>
                      <button 
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => navigate('/login')}
                className="hidden md:flex items-center space-x-1 text-gray-700 hover:text-blue-600"
              >
                <User className="w-6 h-6" />
                <span className="text-sm">Sign In</span>
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => navigate('/wishlist')}
              className="relative hidden md:flex items-center space-x-1 text-gray-700 hover:text-blue-600"
            >
              <Heart className="w-6 h-6" />
              <span className="text-sm">Wishlist</span>
              {wishlistCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                >
                  {wishlistCount}
                </motion.span>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={handleCartClick}
              className="relative flex items-center space-x-1 text-gray-700 hover:text-blue-600"
            >
              <ShoppingCart className="w-6 h-6" />
              <span className="hidden md:block text-sm">Cart</span>
              {cartItemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-yellow-400 text-gray-800 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                >
                  {cartItemCount}
                </motion.span>
              )}
            </motion.button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="flex">
              <input
                type="text"
                value={state.searchQuery}
                onChange={handleSearchChange}
                placeholder="Search..."
                className="w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:border-blue-500"
              />
              <VoiceSearch />
              <button 
                type="submit"
                className="bg-yellow-400 hover:bg-yellow-500 px-4 py-2 rounded-r-lg"
              >
                <Search className="w-5 h-5 text-gray-800" />
              </button>
            </div>
          </form>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 py-4 border-t border-gray-200"
            >
              <div className="space-y-4">
                {!state.user ? (
                  <button 
                    onClick={() => navigate('/login')}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
                  >
                    <User className="w-5 h-5" />
                    <span>Sign In</span>
                  </button>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-gray-700">
                      <img src={state.user.avatar} alt={state.user.name} className="w-6 h-6 rounded-full" />
                      <span>{state.user.name}</span>
                    </div>
                    <button 
                      onClick={() => navigate('/wishlist')}
                      className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
                    >
                      <Heart className="w-5 h-5" />
                      <span>Wishlist ({wishlistCount})</span>
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center space-x-2 text-red-600 hover:text-red-700"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-gray-600" />
                  <select
                    value={state.language}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="bg-transparent text-gray-700"
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Categories Navigation */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center space-x-8 overflow-x-auto">
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                onClick={() => handleCategoryClick(category)}
                className="whitespace-nowrap text-sm text-gray-700 hover:text-blue-600 py-2"
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;