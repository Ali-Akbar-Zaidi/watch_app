
'use client';

import { useState } from 'react';
import { formatPrice } from '@/lib/auth';
import type { Watch } from '@/lib/auth';

interface ProductModalProps {
  watch: Watch;
  onClose: () => void;
  onAddToCart: (watchId: string, quantity: number) => void;
  darkMode: boolean;
}

export default function ProductModal({ watch, onClose, onAddToCart, darkMode }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(watch.id, quantity);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 1500);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className={`max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl ${
        darkMode ? 'bg-gray-900' : 'bg-white'
      }`}>
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/2">
            <img
              src={watch.image}
              alt={watch.name}
              className="w-full h-96 lg:h-full object-cover object-top"
            />
          </div>
          
          <div className="lg:w-1/2 p-8">
            <div className="flex justify-between items-start mb-6">
              <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {watch.name}
              </h2>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <i className="ri-close-line text-xl"></i>
                </div>
              </button>
            </div>

            <div className={`inline-block px-3 py-1 rounded-full text-sm mb-4 ${
              darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
            }`}>
              {watch.category}
            </div>

            <p className={`text-lg mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {watch.description}
            </p>

            <div className="mb-6">
              <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Features
              </h3>
              <ul className="space-y-2">
                {watch.features.map((feature, index) => (
                  <li key={index} className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <div className="w-4 h-4 flex items-center justify-center mr-3">
                      <i className="ri-check-line text-green-500"></i>
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className={`text-3xl font-bold mb-6 ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>
              {formatPrice(watch.price)}
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Quantity:
              </label>
              <div className="flex items-center">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                    darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  <i className="ri-subtract-line"></i>
                </button>
                <span className={`mx-4 text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                    darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  <i className="ri-add-line"></i>
                </button>
              </div>
            </div>

            {showSuccess ? (
              <div className="bg-green-500 text-white px-6 py-3 rounded-lg flex items-center justify-center">
                <div className="w-5 h-5 flex items-center justify-center mr-2">
                  <i className="ri-check-line"></i>
                </div>
                Added to cart successfully!
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 whitespace-nowrap cursor-pointer"
              >
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
