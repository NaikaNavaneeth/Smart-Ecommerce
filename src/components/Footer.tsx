import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, Globe } from 'lucide-react';

const Footer: React.FC = () => {
  const footerLinks = {
    'About SmartShop+': [
      'Our Story',
      'Careers',
      'Press',
      'Investor Relations',
      'Sustainability'
    ],
    'Customer Service': [
      'Help Center',
      'Track Your Order',
      'Returns & Exchanges',
      'Size Guide',
      'Contact Us'
    ],
    'Shopping': [
      'Gift Cards',
      'Mobile App',
      'Student Discount',
      'Site Map',
      'SmartShop+ Credit Card'
    ],
    'AI Features': [
      'Voice Assistant',
      'Visual Search',
      'Chat Support',
      'AR Try-On',
      'Smart Recommendations'
    ]
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'te', name: 'తెలుగు' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'bn', name: 'বাংলা' },
    { code: 'mr', name: 'मराठी' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-blue-600 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Stay Updated with AI-Powered Deals</h3>
          <p className="text-blue-100 mb-6">
            Get personalized offers, new product alerts, and exclusive AI features
          </p>
          <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-yellow-400 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
            >
              Subscribe
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-blue-600 text-white px-3 py-2 rounded-lg font-bold text-xl">
                  S+
                </div>
                <span className="text-2xl font-bold">SmartShop+</span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                India's first AI-powered eCommerce platform with multilingual voice search, 
                visual product discovery, and seamless omni-channel shopping experience.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-blue-400" />
                  <span className="text-sm">1800-123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-blue-400" />
                  <span className="text-sm">support@smartshopplus.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span className="text-sm">Mumbai, Delhi, Bangalore & 500+ cities</span>
                </div>
              </div>
            </div>

            {/* Links Sections */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="font-semibold mb-4">{title}</h4>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Language Selector */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
              <div className="flex items-center space-x-4">
                <Globe className="w-5 h-5 text-gray-400" />
                <span className="text-gray-400">Choose your language:</span>
                <div className="flex flex-wrap gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      className="text-sm text-gray-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-gray-800"
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Social Media */}
              <div className="flex items-center space-x-4">
                <span className="text-gray-400 text-sm">Follow us:</span>
                {[
                  { icon: Facebook, href: '#' },
                  { icon: Twitter, href: '#' },
                  { icon: Instagram, href: '#' },
                  { icon: Youtube, href: '#' }
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    whileHover={{ scale: 1.1 }}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <div className="flex flex-wrap items-center space-x-6 mb-4 md:mb-0">
              <span>© 2024 SmartShop+. All rights reserved.</span>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </div>
            
            <div className="flex items-center space-x-2">
              <span>Powered by AI</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;