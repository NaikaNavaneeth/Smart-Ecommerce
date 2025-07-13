import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Camera, QrCode, ShoppingBag, Star, Zap, Shield, Truck, ArrowRight, Clock, Eye } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import CategoryGrid from '../components/CategoryGrid';
import ContextualRecommendations from '../components/ContextualRecommendations';
import VisualSearch from '../components/VisualSearch';
import CartSync from '../components/CartSync';
import LanguageSelector from '../components/LanguageSelector';
import { useApp } from '../contexts/AppContext';
import { useTranslation } from 'react-i18next';
import productsData from '../data/products.json';

const Home: React.FC = () => {
  const { state } = useApp();
  const { t } = useTranslation();
  const [isVisualSearchOpen, setIsVisualSearchOpen] = useState(false);
  const [isCartSyncOpen, setIsCartSyncOpen] = useState(false);

  const featuredProducts = productsData?.featuredProducts || [];
  const categories = productsData?.categories || [];

  const getUserRecommendations = () => {
    if (!state.userInterests || state.userInterests.length === 0) return [];

    return featuredProducts.filter(product =>
      state.userInterests.some(interest =>
        product.category?.toLowerCase().includes(interest.toLowerCase()) ||
        product.subcategory?.toLowerCase().includes(interest.toLowerCase())
      )
    ).slice(0, 5);
  };

  const allProducts = featuredProducts;

  const displayedProducts = useMemo(() => {
    if (state.currentCategory) {
      return allProducts.filter(
        product => product.category.toLowerCase() === state.currentCategory!.toLowerCase()
      );
    }

    if (state.searchQuery) {
      return allProducts.filter(
        product => product.name.toLowerCase().includes(state.searchQuery.toLowerCase())
      );
    }

    return allProducts;
  }, [state.currentCategory, state.searchQuery]);

  const userRecommendations = getUserRecommendations();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="absolute top-4 right-4 z-10">
        <LanguageSelector />
      </header>

      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {state.user ? t('welcome_back', { name: state.user.name }) : t('welcome')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              {t('hero_tagline')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsVisualSearchOpen(true)}
                className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
              >
                <Camera className="w-5 h-5" />
                <span>{t('try_visual')}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsCartSyncOpen(true)}
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-colors flex items-center justify-center space-x-2"
              >
                <QrCode className="w-5 h-5" />
                <span>{t('sync_cart')}</span>
              </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
              {[
                { icon: Search, title: t('feature_voice'), desc: t('feature_voice_desc') },
                { icon: Camera, title: t('feature_visual'), desc: t('feature_visual_desc') },
                { icon: Zap, title: t('feature_ai'), desc: t('feature_ai_desc') },
                { icon: QrCode, title: t('feature_sync'), desc: t('feature_sync_desc') }
              ].map((feature, index) => (
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
              {t('shop_by_category')}
            </h2>
            <CategoryGrid categories={categories} />
          </motion.div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('search_results')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </section>

        {state.user && userRecommendations.length > 0 && (
          <section className="mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-500 p-2 rounded-full">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{t('your_interests')}</h2>
                    <p className="text-gray-600">{t('interests_subtitle')}</p>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1">
                  <span>{t('view_all')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userRecommendations.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            </motion.div>
          </section>
        )}

        {state.user && state.recentlyViewed?.length > 0 && (
          <section className="mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-purple-500 p-2 rounded-full">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{t('recently_viewed')}</h2>
                  <p className="text-gray-600">{t('recently_subtitle')}</p>
                </div>
              </div>
              <div className="flex space-x-4 overflow-x-auto pb-4">
                {state.recentlyViewed.map((product, index) => (
                  <div key={product.id} className="flex-shrink-0 w-64">
                    <ProductCard product={product} index={index} />
                  </div>
                ))}
              </div>
            </motion.div>
          </section>
        )}

        <section className="mb-12">
          <ContextualRecommendations />
        </section>

        <section className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-800">{t('featured_products')}</h2>
              <button className="text-blue-600 hover:text-blue-700 font-medium">
                {t('view_all')}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </motion.div>
        </section>

        <section className="bg-white rounded-xl p-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: Shield, title: t('secure_payment'), desc: t('secure_desc') },
              { icon: Truck, title: t('free_shipping'), desc: t('shipping_desc') },
              { icon: Star, title: t('rating'), desc: t('rating_desc') },
              { icon: ShoppingBag, title: t('products_count'), desc: t('products_desc') }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="flex flex-col items-center"
              >
                <div className="bg-blue-100 p-4 rounded-full mb-4">
                  <item.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      <VisualSearch isOpen={isVisualSearchOpen} onClose={() => setIsVisualSearchOpen(false)} />
      <CartSync isOpen={isCartSyncOpen} onClose={() => setIsCartSyncOpen(false)} />
    </div>
  );
};

export default Home;
