import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Cloud, Sun, CloudRain, Snowflake, Clock, Calendar } from 'lucide-react';
import ProductCard from './ProductCard';
import { useApp } from '../contexts/AppContext';
import productsData from '../data/products.json';

const ContextualRecommendations: React.FC = () => {
  const { state, dispatch } = useApp();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState('Mumbai');
  const [weather, setWeather] = useState('sunny');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Simulate weather API call
    const mockWeatherConditions = ['sunny', 'rainy', 'cloudy', 'hot'];
    const randomWeather = mockWeatherConditions[Math.floor(Math.random() * mockWeatherConditions.length)];
    setWeather(randomWeather);
    dispatch({ type: 'SET_WEATHER', payload: randomWeather });
  }, [dispatch]);

  const getWeatherIcon = (weatherCondition: string) => {
    switch (weatherCondition) {
      case 'sunny':
        return <Sun className="w-5 h-5 text-yellow-500" />;
      case 'rainy':
        return <CloudRain className="w-5 h-5 text-blue-500" />;
      case 'cloudy':
        return <Cloud className="w-5 h-5 text-gray-500" />;
      case 'snow':
        return <Snowflake className="w-5 h-5 text-blue-300" />;
      default:
        return <Sun className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getTimeBasedGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getContextualProducts = () => {
    if (weather === 'rainy' && productsData.contextualRecommendations.rainy) {
      return productsData.contextualRecommendations.rainy;
    }
    
    const hour = currentTime.getHours();
    if (hour >= 10 && hour <= 16 && productsData.contextualRecommendations.summer) {
      return productsData.contextualRecommendations.summer;
    }
    
    return productsData.featuredProducts.slice(0, 3);
  };

  const getRecommendationTitle = () => {
    if (weather === 'rainy') {
      return `It's raining in ${location} – Stay dry with these essentials`;
    }
    
    const hour = currentTime.getHours();
    if (hour >= 10 && hour <= 16) {
      return `Beat the heat in ${location} – Cool down with these picks`;
    }
    
    if (hour >= 18 || hour <= 6) {
      return `Evening essentials for ${location}`;
    }
    
    return `Trending now in ${location}`;
  };

  const contextualProducts = getContextualProducts();

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 my-8">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">{location}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              {getWeatherIcon(weather)}
              <span className="text-sm font-medium capitalize">{weather}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {getTimeBasedGreeting()}! 🌟
          </h2>
          <p className="text-lg text-gray-700 font-medium">
            {getRecommendationTitle()}
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {contextualProducts.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-white/50"
      >
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>
            Recommendations updated based on your location, current weather, and time of day
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default ContextualRecommendations;