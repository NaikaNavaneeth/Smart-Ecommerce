import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Camera, QrCode, ShoppingBag, Star, Zap, Shield, Truck, ArrowRight, Clock, Eye } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import CategoryGrid from '../components/CategoryGrid';
import ContextualRecommendations from '../components/ContextualRecommendations';
import VisualSearch from '../components/VisualSearch';
import CartSync from '../components/CartSync';
import { useApp } from '../contexts/AppContext';
import { supabase } from '../lib/supabase';
import { Product } from '../types/product';


const Home: React.FC = () => {
  const { state } = useApp();
  const [isVisualSearchOpen, setIsVisualSearchOpen] = useState(false);
  const [isCartSyncOpen, setIsCartSyncOpen] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from('products').select('*');
      if (!error && data) {
        setAllProducts(data);
        setFilteredProducts(data);
      }
    };
    fetchProducts();
  }, []);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    const filtered = allProducts.filter((p: any) => p.category === category);
    setFilteredProducts(filtered);
  };

  const resetCategory = () => {
    setSelectedCategory(null);
    setFilteredProducts(allProducts);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {state.user ? `Welcome back, ${state.user.name}!` : 'Welcome to SmartShop+'}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              AI-Powered Shopping Experience with Multilingual Support
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsVisualSearchOpen(true)}
                className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
              >
                <Camera className="w-5 h-5" />
                <span>Try Visual Search</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsCartSyncOpen(true)}
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-colors flex items-center justify-center space-x-2"
              >
                <QrCode className="w-5 h-5" />
                <span>Sync Your Cart</span>
              </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
              {[{ icon: Search, title: 'Voice Search', desc: 'Search in your language' }, { icon: Camera, title: 'Visual Search', desc: 'Find products by photo' }, { icon: Zap, title: 'AI Assistant', desc: 'Smart recommendations' }, { icon: QrCode, title: 'Cart Sync', desc: 'Seamless shopping' }].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center"
                >
                  <feature.icon className="w-8 h-8 mx-auto mb-3 text-blue-200" />
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-blue-100">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <section className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              {selectedCategory ? `${selectedCategory} Products` : 'All Products'}
            </h2>

            {selectedCategory && (
              <div className="text-center mb-4">
                <button onClick={resetCategory} className="text-sm text-blue-600 underline">
                  Clear Filter
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product: any, index: number) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </motion.div>
        </section>

        <section className="mb-12">
          <ContextualRecommendations />
        </section>
      </div>

      <VisualSearch isOpen={isVisualSearchOpen} onClose={() => setIsVisualSearchOpen(false)} />
      <CartSync isOpen={isCartSyncOpen} onClose={() => setIsCartSyncOpen(false)} />
    </div>
  );
};

export default Home;
