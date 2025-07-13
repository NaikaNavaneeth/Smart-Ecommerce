import React from 'react';
import { motion } from 'framer-motion';
import { Category } from '../types';
import * as Icons from 'lucide-react';

interface CategoryGridProps {
  categories: Category[];
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ categories }) => {
  const getIcon = (iconName: string) => {
    const IconComponent = Icons[iconName as keyof typeof Icons] as any;
    return IconComponent ? <IconComponent className="w-8 h-8" /> : <Icons.Package className="w-8 h-8" />;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 my-8">
      {categories.map((category, index) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05, y: -5 }}
          className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group"
        >
          <div className="text-center">
            <div className="relative overflow-hidden rounded-lg mb-4">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-20 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                <div className="text-white">
                  {getIcon(category.icon)}
                </div>
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
              {category.name}
            </h3>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default CategoryGrid;