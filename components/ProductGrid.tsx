'use client';

import { useState, useEffect } from 'react';
import { getWatches, addToCart, formatPrice } from '@/lib/auth';
import type { Watch } from '@/lib/auth';
import ProductModal from './ProductModal';

interface ProductGridProps {
  searchQuery: string;
  selectedCategory: string;
  darkMode: boolean;
}

export default function ProductGrid({ searchQuery, selectedCategory, darkMode }: ProductGridProps) {
  const [watches, setWatches] = useState<Watch[]>([]);
  const [selectedWatch, setSelectedWatch] = useState<Watch | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const loadWatches = () => {
      let allWatches = getWatches();
      
      if (searchQuery) {
        allWatches = allWatches.filter(watch =>
          watch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          watch.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      if (selectedCategory && selectedCategory !== 'All') {
        allWatches = allWatches.filter(watch => watch.category === selectedCategory);
      }
      
      setWatches(allWatches);
    };
    
    loadWatches();
  }, [searchQuery, selectedCategory]);

  const handleAddToCart = (watchId: string) => {
    addToCart(watchId, 1);
  };

  const handleProductClick = (watch: Watch) => {
    setSelectedWatch(watch);
    setShowModal(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {watches.map((watch) => (
          <div
            key={watch.id}
            className={`rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer relative ${
              darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
            }`}
            onClick={() => handleProductClick(watch)}
          >
            {/* Discount Badge */}
            {(watch as any).originalPrice && (watch as any).originalPrice !== watch.price && (
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                  -{(watch as any).discountPercentage}% OFF
                </span>
              </div>
            )}

            <div className="aspect-square overflow-hidden">
              <img
                src={watch.image}
                alt={watch.name}
                className="w-full h-full object-cover object-top transition-transform duration-300 hover:scale-110"
              />
            </div>
            <div className="p-6">
              <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {watch.name}
              </h3>
              <p className={`text-sm mb-4 line-clamp-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {watch.description}
              </p>
              
              {/* Price Display with Discount Support */}
              <div className="mb-4">
                {(watch as any).originalPrice && (watch as any).originalPrice !== watch.price ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-lg line-through ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {formatPrice((watch as any).originalPrice)}
                      </span>
                    </div>
                    <span className={`text-2xl font-bold text-green-600 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                      {formatPrice(watch.price)}
                    </span>
                    <p className={`text-sm ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                      You save {formatPrice((watch as any).originalPrice - watch.price)}
                    </p>
                  </div>
                ) : (
                  <span className={`text-2xl font-bold ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                    {formatPrice(watch.price)}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div></div> {/* Empty div to maintain layout */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(watch.id);
                  }}
                  className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white px-4 py-2 rounded-lg transition-all duration-300 whitespace-nowrap cursor-pointer"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {watches.length === 0 && (
        <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <i className="ri-search-line text-4xl"></i>
          </div>
          <p className="text-xl">No watches found</p>
          <p className="mt-2">Try adjusting your search or filters</p>
        </div>
      )}

      {showModal && selectedWatch && (
        <ProductModal
          watch={selectedWatch}
          onClose={() => setShowModal(false)}
          onAddToCart={handleAddToCart}
          darkMode={darkMode}
        />
      )}
    </>
  );
}