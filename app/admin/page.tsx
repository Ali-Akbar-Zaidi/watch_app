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
  const [showDiscountForm, setShowDiscountForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Watch | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  const [discountData, setDiscountData] = useState({
    percentage: '',
    category: 'all' as 'all' | 'Simple' | 'Luxury' | 'Vintage'
  });
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

  // Function to get all registered users except admin
  const getRegisteredUsers = () => {
    try {
      const users = JSON.parse(localStorage.getItem('beguiling_chronos_users') || '[]');
      return users.filter((user: any) => !user.isAdmin && user.email);
    } catch (error) {
      console.error('Error getting registered users:', error);
      return [];
    }
  };

  // Function to send discount emails
  const sendDiscountEmails = async (discountPercent: number, category: string, affectedProducts: Watch[]) => {
    const users = getRegisteredUsers();
    
    if (users.length === 0) {
      console.log('No registered users to send emails to');
      return;
    }

    const categoryText = category === 'all' ? 'all products' : `${category} watches`;
    const productList = affectedProducts.map(product => ({
      name: product.name,
      originalPrice: (product as any).originalPrice || product.price,
      discountedPrice: product.price,
      savings: ((product as any).originalPrice || product.price) - product.price
    }));

    // Send email to each user
    for (const user of users) {
      try {
        const emailData = {
          to: user.email,
          subject: `🎉 Special Discount Alert - ${discountPercent}% OFF!`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px;">
              <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h1 style="color: #d97706; text-align: center; margin-bottom: 20px;">🎉 Beguiling Chronos Special Offer!</h1>
                <h2 style="color: #333; text-align: center;">${discountPercent}% OFF on ${categoryText}!</h2>
                
                <p style="color: #666; font-size: 16px; line-height: 1.6;">
                  Dear ${user.username || 'Valued Customer'},
                </p>
                
                <p style="color: #666; font-size: 16px; line-height: 1.6;">
                  We're excited to offer you an exclusive discount on our premium timepieces! 
                  For a limited time, enjoy <strong style="color: #dc2626;">${discountPercent}% OFF</strong> on ${categoryText}.
                </p>
                
                <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="color: #92400e; margin-top: 0;">Discounted Products:</h3>
                  ${productList.map(product => `
                    <div style="border-bottom: 1px solid #e5e7eb; padding: 10px 0;">
                      <strong style="color: #374151;">${product.name}</strong><br>
                      <span style="text-decoration: line-through; color: #6b7280;">PKR ${product.originalPrice.toLocaleString()}</span>
                      <span style="color: #dc2626; font-weight: bold; margin-left: 10px;">PKR ${product.discountedPrice.toLocaleString()}</span>
                      <span style="color: #059669; font-size: 14px; margin-left: 10px;">(Save PKR ${product.savings.toLocaleString()})</span>
                    </div>
                  `).join('')}
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${window.location.origin}" 
                     style="background: linear-gradient(to right, #d97706, #eab308); 
                            color: white; 
                            padding: 15px 30px; 
                            text-decoration: none; 
                            border-radius: 25px; 
                            font-weight: bold; 
                            display: inline-block;
                            box-shadow: 0 4px 15px rgba(217, 119, 6, 0.3);">
                    🛒 Shop Now & Save!
                  </a>
                </div>
                
                <p style="color: #666; font-size: 14px; text-align: center; margin-top: 30px;">
                  Hurry! This offer won't last long. Visit our store now to grab these amazing deals.
                </p>
                
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                
                <p style="color: #9ca3af; font-size: 12px; text-align: center;">
                  This email was sent from Beguiling Chronos - "Where Time Meets Elegance"<br>
                  You received this email because you have an account with us.
                </p>
              </div>
            </div>
          `
        };

        // Make API call to send email
        const response = await fetch('https://link-app-backend-production-68e6.up.railway.app/api/v1/users/send-discount-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(emailData)
        });

        if (!response.ok) {
          console.error(`Failed to send email to ${user.email}`);
        } else {
          console.log(`Email sent successfully to ${user.email}`);
        }
      } catch (error) {
        console.error(`Error sending email to ${user.email}:`, error);
      }
    }
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

  const handleDiscountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const discountPercent = parseFloat(discountData.percentage);
    if (discountPercent <= 0 || discountPercent >= 100) {
      return;
    }

    setIsApplyingDiscount(true);

    try {
      const affectedProducts: Watch[] = [];
      const updatedProducts = products.map(product => {
        if (discountData.category === 'all' || product.category === discountData.category) {
          const originalPrice = (product as any).originalPrice || product.price;
          const discountedPrice = originalPrice * (1 - discountPercent / 100);
          const updatedProduct = {
            ...product,
            price: Math.round(discountedPrice),
            originalPrice: originalPrice,
            discountPercentage: discountPercent
          };
          saveWatch(updatedProduct);
          affectedProducts.push(updatedProduct);
          return updatedProduct;
        }
        return product;
      });

      setProducts(updatedProducts);

      // Send emails to all registered users
      await sendDiscountEmails(discountPercent, discountData.category, affectedProducts);

      setShowDiscountForm(false);
      setDiscountData({
        percentage: '',
        category: 'all'
      });

      const categoryText = discountData.category === 'all' ? 'all products' : `${discountData.category} watches`;
      const userCount = getRegisteredUsers().length;
    } catch (error) {
      console.error('Error applying discount:', error);
    } finally {
      setIsApplyingDiscount(false);
    }
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
          <div className="flex gap-3">
            <button
              onClick={() => setShowDiscountForm(true)}
              disabled={isApplyingDiscount}
              className={`bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                isApplyingDiscount ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isApplyingDiscount ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Applying...
                </>
              ) : (
                'Apply Discount'
              )}
            </button>
            <button
              onClick={() => {
                const updatedProducts = products.map(product => {
                  if ((product as any).originalPrice) {
                    const restoredProduct = {
                      ...product,
                      price: (product as any).originalPrice
                    };
                    delete (restoredProduct as any).originalPrice;
                    delete (restoredProduct as any).discountPercentage;
                    saveWatch(restoredProduct);
                    return restoredProduct;
                  }
                  return product;
                });
                setProducts(updatedProducts);
              }}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 whitespace-nowrap cursor-pointer flex items-center gap-2"
            >
              Remove All Discounts
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 whitespace-nowrap cursor-pointer"
            >
              Add Product
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className={`rounded-2xl overflow-hidden shadow-lg  transition-all duration-300 ${
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
                
                <div className="mb-4">
                  {(product as any).originalPrice && (product as any).originalPrice !== product.price ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-lg line-through ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          {formatPrice((product as any).originalPrice)}
                        </span>
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                          -{(product as any).discountPercentage}%
                        </span>
                      </div>
                      <p className={`text-xl font-bold text-green-600 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                        {formatPrice(product.price)}
                      </p>
                    </div>
                  ) : (
                    <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {formatPrice(product.price)}
                    </p>
                  )}
                </div>
                
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

      {/* Product Form Modal */}
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

      {/* Discount Form Modal */}
      {showDiscountForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`rounded-2xl p-6 max-w-md w-full mx-4 ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Apply Discount & Send Notifications
            </h3>
            
            <form onSubmit={handleDiscountSubmit} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Discount Percentage
                </label>
                <input
                  type="number"
                  placeholder="Enter discount percentage (e.g., 10)"
                  value={discountData.percentage}
                  onChange={(e) => setDiscountData({...discountData, percentage: e.target.value})}
                  required
                  min="1"
                  max="99"
                  step="0.01"
                  disabled={isApplyingDiscount}
                  className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 ${
                    isApplyingDiscount ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Apply to Category
                </label>
                <div className="relative">
                  <select
                    value={discountData.category}
                    onChange={(e) => setDiscountData({...discountData, category: e.target.value as 'all' | 'Simple' | 'Luxury' | 'Vintage'})}
                    disabled={isApplyingDiscount}
                    className={`w-full px-4 py-3 pr-8 rounded-xl border transition-colors appearance-none ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 ${
                      isApplyingDiscount ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <option value="all">All Products</option>
                    <option value="Simple">Simple Watches</option>
                    <option value="Luxury">Luxury Watches</option>
                    <option value="Vintage">Vintage Watches</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <div className="w-4 h-4 flex items-center justify-center">
                      <i className={`ri-arrow-down-s-line ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}></i>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-lg ${darkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
                <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                  📧 Email notifications will be sent to all registered users (excluding admins) about this discount offer.
                </p>
              </div>

              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-yellow-50'}`}>
                <p className={`text-sm ${darkMode ? 'text-yellow-400' : 'text-yellow-800'}`}>
                  ⚠️ This will permanently modify the prices of the selected products. This action cannot be undone.
                </p>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowDiscountForm(false);
                    setDiscountData({
                      percentage: '',
                      category: 'all'
                    });
                  }}
                  disabled={isApplyingDiscount}
                  className={`flex-1 py-3 px-6 rounded-xl transition-colors cursor-pointer ${
                    darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  } ${isApplyingDiscount ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isApplyingDiscount}
                  className={`flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 whitespace-nowrap cursor-pointer flex items-center justify-center gap-2 ${
                    isApplyingDiscount ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isApplyingDiscount ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Applying & Sending Emails...
                    </>
                  ) : (
                    'Apply Discount & Send Emails'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
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