import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, X, Loader, Search } from 'lucide-react';
import ProductCard from './ProductCard';
import { Product } from '../types';

interface VisualSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const VisualSearch: React.FC<VisualSearchProps> = ({ isOpen, onClose }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const mockResults: Product[] = [
    {
      id: 11,
      name: "Similar Smartphone - OnePlus 11",
      price: 56999,
      originalPrice: 61999,
      image: "https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 4.6,
      reviews: 1234,
      category: "Electronics",
      inStock: true,
      description: "Flagship smartphone with similar design"
    },
    {
      id: 12,
      name: "iPhone 15 Pro",
      price: 134900,
      originalPrice: 139900,
      image: "https://images.pexels.com/photos/1275229/pexels-photo-1275229.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 4.8,
      reviews: 2156,
      category: "Electronics",
      inStock: true,
      description: "Premium smartphone with advanced features"
    },
    {
      id: 13,
      name: "Google Pixel 8 Pro",
      price: 84999,
      originalPrice: 89999,
      image: "https://images.pexels.com/photos/3999693/pexels-photo-3999693.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 4.5,
      reviews: 987,
      category: "Electronics",
      inStock: true,
      description: "AI-powered photography smartphone"
    }
  ];

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const performVisualSearch = async () => {
    if (!selectedImage) return;

    setIsSearching(true);
    
    // Simulate AI visual search processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSearchResults(mockResults);
    setIsSearching(false);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      video.onloadedmetadata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context?.drawImage(video, 0, 0);
        
        const imageData = canvas.toDataURL('image/jpeg');
        setSelectedImage(imageData);
        
        stream.getTracks().forEach(track => track.stop());
      };
    } catch (error) {
      console.error('Camera access failed:', error);
      alert('Camera access failed. Please try uploading an image instead.');
    }
  };

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
            className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Visual Search</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {!selectedImage && !searchResults.length && (
                <div className="space-y-6">
                  <p className="text-gray-600 text-center">
                    Upload an image or take a photo to find similar products
                  </p>
                  
                  {/* Upload Area */}
                  <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                      dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-700 mb-2">
                      Drag and drop an image here
                    </p>
                    <p className="text-gray-500 mb-4">or</p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <label className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer inline-flex items-center space-x-2">
                        <Upload className="w-4 h-4" />
                        <span>Choose File</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                      </label>
                      
                      <button
                        onClick={startCamera}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors inline-flex items-center space-x-2"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Take Photo</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {selectedImage && !searchResults.length && (
                <div className="space-y-6">
                  <div className="relative">
                    <img
                      src={selectedImage}
                      alt="Selected"
                      className="w-full max-h-64 object-contain bg-gray-100 rounded-lg"
                    />
                    <button
                      onClick={() => setSelectedImage(null)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={performVisualSearch}
                    disabled={isSearching}
                    className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {isSearching ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        <span>Searching...</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5" />
                        <span>Find Similar Products</span>
                      </>
                    )}
                  </motion.button>
                </div>
              )}

              {searchResults.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-800">
                      Similar Products Found
                    </h3>
                    <button
                      onClick={() => {
                        setSelectedImage(null);
                        setSearchResults([]);
                      }}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Search Again
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {searchResults.map((product, index) => (
                      <ProductCard key={product.id} product={product} index={index} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VisualSearch;