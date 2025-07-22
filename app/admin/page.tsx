'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import ImageUpload from '@/components/ImageUpload';
import { getCurrentUser, getWatches, saveWatch, deleteWatch } from '@/lib/auth';
import type { Watch } from '@/lib/auth';

interface AdminPageProps {
  onPageChange: (page: 'home' | 'checkout' | 'admin') => void;
  onLogout: () => void;
}

export default function AdminPage({ onPageChange, onLogout }: AdminPageProps) {
  const [products, setProducts] = useState<Watch[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Watch | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    features: '',
    category: 'Simple' as 'Simple' | 'Luxury' | 'Vintage',
    image: ''
  });

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
    
    const user = getCurrentUser();
    if (!user?.isAdmin) {
      if (onPageChange) {
        onPageChange('home');
      }
      return;
    }
    
    setProducts(getWatches());
  }, [onPageChange]);

  const handleDarkModeToggle = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
  };

  const generateFallbackImage = (category: string, name: string) => {
    const encodedQuery = encodeURIComponent(`luxury ${category.toLowerCase()} watch ${name} premium timepiece elegant design sophisticated craftsmanship on simple white background professional product photography`);
    return `https://readdy.ai/api/search-image?query=${encodedQuery}&width=400&height=400&seq=${Date.now()}&orientation=squarish`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      features: formData.features.split('\n').filter(f => f.trim()),
      image: formData.image || generateFallbackImage(formData.category, formData.name)
    };

    if (editingProduct) {
      const updatedProduct: Watch = {
        ...editingProduct,
        ...productData
      };
      saveWatch(updatedProduct);
    } else {
      const newProduct: Watch = {
        id: Date.now().toString(),
        ...productData
      };
      saveWatch(newProduct);
    }

    setProducts(getWatches());
    setShowForm(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      price: '',
      description: '',
      features: '',
      category: 'Simple',
      image: ''
    });
  };

  const handleEdit = (product: Watch) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      features: product.features.join('\n'),
      category: product.category,
      image: product.image
    });
    setShowForm(true);
  };

  const handleDelete = () => {
    if (showDeleteConfirm) {
      deleteWatch(showDeleteConfirm);
      setProducts(getWatches());
      setShowDeleteConfirm(null);
    }
  };

  const handleImageChange = (imageUrl: string) => {
    setFormData({ ...formData, image: imageUrl });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <Header 
        onLogout={onLogout} 
        onCartClick={() => {}} 
        darkMode={darkMode}
        onDarkModeToggle={handleDarkModeToggle}
        showCartButton={false}
      />
      
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Admin Dashboard
          </h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 whitespace-nowrap cursor-pointer"
          >
            Add Product
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className={`rounded-2xl overflow-hidden shadow-lg transition-all duration-300 ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover object-center"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = generateFallbackImage(product.category, product.name);
                }}
              />
              
              <div className="p-6">
                <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {product.name}
                </h3>
                <p className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {product.category}
                </p>
                <p className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {formatPrice(product.price)}
                </p>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className={`flex-1 py-2 px-4 rounded-lg transition-colors cursor-pointer ${
                      darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(product.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
          <div className={`rounded-2xl p-6 max-w-md w-full mx-4 my-8 max-h-[90vh] overflow-y-auto ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {editingProduct ? 'Edit Product' : 'Add Product'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Product Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500`}
              />
              
              <input
                type="number"
                placeholder="Price (PKR)"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required
                min="0"
                step="0.01"
                className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500`}
              />
              
              <div className="relative">
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value as 'Simple' | 'Luxury' | 'Vintage'})}
                  className={`w-full px-4 py-3 pr-8 rounded-xl border transition-colors appearance-none ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500`}
                >
                  <option value="Simple">Simple</option>
                  <option value="Luxury">Luxury</option>
                  <option value="Vintage">Vintage</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className={`ri-arrow-down-s-line ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}></i>
                  </div>
                </div>
              </div>

              <ImageUpload
                currentImage={formData.image}
                onImageChange={handleImageChange}
                darkMode={darkMode}
              />
              
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
                rows={3}
                className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500`}
              />
              
              <textarea
                placeholder="Features (one per line)"
                value={formData.features}
                onChange={(e) => setFormData({...formData, features: e.target.value})}
                required
                rows={4}
                className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500`}
              />
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingProduct(null);
                    setFormData({
                      name: '',
                      price: '',
                      description: '',
                      features: '',
                      category: 'Simple',
                      image: ''
                    });
                  }}
                  className={`flex-1 py-3 px-6 rounded-xl transition-colors cursor-pointer ${
                    darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 whitespace-nowrap cursor-pointer"
                >
                  {editingProduct ? 'Update' : 'Add'} Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`rounded-2xl p-6 max-w-sm w-full mx-4 ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Delete Product
            </h3>
            <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className={`flex-1 py-2 px-4 rounded-lg transition-colors cursor-pointer ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}