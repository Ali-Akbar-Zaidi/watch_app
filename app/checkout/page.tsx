'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { getCartWithDetails, updateCartItem, removeFromCart, clearCart } from '@/lib/auth';
import type { CartItem } from '@/lib/auth';
interface CheckoutPageProps {
  onPageChange: (page: 'home' | 'checkout' | 'admin') => void;
  onLogout: () => void;
}

export default function CheckoutPage({ onPageChange, onLogout }: CheckoutPageProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    paymentMethod: 'Card',
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    cardholderName: '',
    jazzCashPhone: '',
    easypaisaPhone: ''
  });
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
    loadCart();
  }, []);

  const generateOrderNumber = () => {
    return 'BC-' + Date.now().toString().slice(-8);
  };

  const getExpectedDeliveryDate = () => {
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + 5); // 5 days from now
    return deliveryDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const loadCart = () => {
  const cartData = getCartWithDetails();
  setCart(cartData);
};

  const handleDarkModeToggle = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
  };

  const handleCartClick = () => {
    onPageChange('checkout');
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) return;
    updateCartItem(id, quantity);
    loadCart();
  };

  const confirmDelete = (id: string) => {
    setShowDeleteConfirm(id);
  };

  const handleDelete = () => {
    if (showDeleteConfirm) {
      removeFromCart(showDeleteConfirm);
      loadCart();
      setShowDeleteConfirm(null);
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.watch.price * item.quantity), 0);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!formData.address.trim()) {
      errors.address = 'Address is required';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\+?92\d{10}$|^0\d{10}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      errors.phone = 'Please enter a valid Pakistani phone number';
    }

    if (formData.paymentMethod === 'Card') {
      if (!formData.cardNumber.trim()) {
        errors.cardNumber = 'Card number is required';
      } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
        errors.cardNumber = 'Please enter a valid 16-digit card number';
      }

      if (!formData.expiryDate.trim()) {
        errors.expiryDate = 'Expiry date is required';
      } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) {
        errors.expiryDate = 'Please enter date in MM/YY format';
      }

      if (!formData.cvc.trim()) {
        errors.cvc = 'CVC is required';
      } else if (!/^\d{3,4}$/.test(formData.cvc)) {
        errors.cvc = 'Please enter a valid 3 or 4-digit CVC';
      }

      if (!formData.cardholderName.trim()) {
        errors.cardholderName = 'Cardholder name is required';
      }
    } else if (formData.paymentMethod === 'JazzCash') {
      if (!formData.jazzCashPhone.trim()) {
        errors.jazzCashPhone = 'JazzCash phone number is required';
      } else if (!/^\+?92\d{10}$|^0\d{10}$/.test(formData.jazzCashPhone.replace(/[\s-]/g, ''))) {
        errors.jazzCashPhone = 'Please enter a valid Pakistani phone number';
      }
    } else if (formData.paymentMethod === 'Easypaisa') {
      if (!formData.easypaisaPhone.trim()) {
        errors.easypaisaPhone = 'Easypaisa phone number is required';
      } else if (!/^\+?92\d{10}$|^0\d{10}$/.test(formData.easypaisaPhone.replace(/[\s-]/g, ''))) {
        errors.easypaisaPhone = 'Please enter a valid Pakistani phone number';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    if (validateForm()) {
      const orderNum = generateOrderNumber();
      const expectedDelivery = getExpectedDeliveryDate();
      setOrderNumber(orderNum);
      setDeliveryDate(expectedDelivery);
      clearCart();
      setCart([]);
      setOrderComplete(true);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (orderComplete) {
    return (
      <div 
        className={`min-h-screen transition-colors duration-300 relative ${
          darkMode ? 'bg-gray-900' : 'bg-gray-50'
        }`}
        style={{
          backgroundImage: `url('https://readdy.ai/api/search-image?query=luxury%20watches%20and%20gift%20boxes%20celebration%20background%20with%20elegant%20packaging%2C%20sparkling%20lights%20and%20premium%20timepieces%20arranged%20beautifully%20on%20silk%20fabric%20with%20golden%20ribbons%20and%20presents%2C%20professional%20product%20photography%20style%20with%20warm%20ambient%20lighting%20and%20festive%20atmosphere&width=1920&height=1080&seq=order-confirmation-bg&orientation=landscape')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        
        <Header 
          onLogout={onLogout} 
          onCartClick={handleCartClick}
          darkMode={darkMode}
          onDarkModeToggle={handleDarkModeToggle}
        />
        
        <div className="relative z-10 max-w-3xl mx-auto px-6 py-16">
          <div className={`text-center p-12 rounded-2xl backdrop-blur-lg ${
            darkMode ? 'bg-gray-800/90' : 'bg-white/90'
          } shadow-2xl border border-white/20`}>
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
              <i className="ri-check-line text-3xl text-white"></i>
            </div>
            
            <h2 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Order Confirmed!
            </h2>
            
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${
              darkMode ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-100 text-amber-800'
            }`}>
              <i className="ri-number-1 text-lg"></i>
              <span className="font-semibold">Order #{orderNumber}</span>
            </div>
            
            <p className={`text-lg mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Thank you for your purchase! Your luxury timepiece order has been successfully placed.
            </p>
            
            <div className={`flex items-center justify-center gap-3 mb-8 p-4 rounded-xl ${
              darkMode ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-50 text-blue-800'
            }`}>
              <i className="ri-truck-line text-xl"></i>
              <div>
                <p className="font-medium">Expected Delivery</p>
                <p className="text-sm opacity-90">{deliveryDate}</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onPageChange('home')}
                className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 whitespace-nowrap cursor-pointer shadow-lg"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => window.print()}
                className={`font-semibold py-3 px-8 rounded-xl transition-all duration-300 whitespace-nowrap cursor-pointer shadow-lg ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
              >
                <i className="ri-printer-line mr-2"></i>
                Print Receipt
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <Header 
        onLogout={onLogout} 
        onCartClick={handleCartClick}
        darkMode={darkMode}
        onDarkModeToggle={handleDarkModeToggle}
      />
      
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className={`text-3xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Shopping Cart
        </h1>

        {cart.length === 0 ? (
          <div className={`text-center py-16 rounded-2xl ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-lg`}>
            <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <i className="ri-shopping-cart-line text-2xl text-gray-400"></i>
            </div>
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Your cart is empty
            </h2>
            <button
              onClick={() => onPageChange('home')}
              className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 whitespace-nowrap cursor-pointer"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className={`rounded-2xl p-6 ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } shadow-lg`}>
                <div className="space-y-6">
                  {cart.map((item) => (
                    <div key={item.id} className={`flex items-center gap-4 p-4 rounded-xl border ${
                      darkMode ? 'border-gray-700' : 'border-gray-200'
                    }`}>
                      <img
                        src={item.watch.image}
                        alt={item.watch.name}
                        className="w-20 h-20 object-cover rounded-lg object-top"
                      />
                      
                      <div className="flex-1">
                        <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {item.watch.name}
                        </h3>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {formatPrice(item.watch.price)}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                            darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          }`}
                        >
                          <div className="w-4 h-4 flex items-center justify-center">
                            <i className="ri-subtract-line text-sm"></i>
                          </div>
                        </button>
                        
                        <span className={`w-8 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {item.quantity}
                        </span>
                        
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                            darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          }`}
                        >
                          <div className="w-4 h-4 flex items-center justify-center">
                            <i className="ri-add-line text-sm"></i>
                          </div>
                        </button>
                      </div>

                      <button
                        onClick={() => confirmDelete(item.id)}
                        className={`p-2 rounded-lg transition-colors cursor-pointer ${
                          darkMode ? 'hover:bg-gray-700 text-red-400' : 'hover:bg-red-50 text-red-600'
                        }`}
                      >
                        <div className="w-5 h-5 flex items-center justify-center">
                          <i className="ri-delete-bin-line"></i>
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className={`rounded-2xl p-6 ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } shadow-lg`}>
                <h3 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Order Summary
                </h3>
                
                <div className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Total: {formatPrice(calculateTotal())}
                </div>

                <div className={`flex items-center gap-2 text-sm mb-6 p-3 rounded-lg ${
                  darkMode ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-50 text-blue-700'
                }`}>
                  <i className="ri-truck-line"></i>
                  <span>Expected delivery in 5-7 business days</span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 ${
                        formErrors.name ? 'border-red-500' : ''
                      }`}
                    />
                    {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
                  </div>
                  
                  <div>
                    <textarea
                      placeholder="Address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      rows={3}
                      className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 ${
                        formErrors.address ? 'border-red-500' : ''
                      }`}
                    />
                    {formErrors.address && <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>}
                  </div>
                  
                  <div>
                    <input
                      type="tel"
                      placeholder="Phone Number (e.g., +92 300 1234567)"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 ${
                        formErrors.phone ? 'border-red-500' : ''
                      }`}
                    />
                    {formErrors.phone && <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>}
                  </div>
                  
                  <div className="space-y-3">
                    <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Payment Method
                    </label>
                    <div className="space-y-2">
                      {['Card', 'JazzCash', 'Easypaisa'].map((method) => (
                        <label key={method} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method}
                            checked={formData.paymentMethod === method}
                            onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                            className="text-amber-600 focus:ring-amber-500"
                          />
                          <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {method}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {formData.paymentMethod === 'Card' && (
                    <div className="space-y-4 border-t pt-4">
                      <div>
                        <input
                          type="text"
                          placeholder="Card Number (16 digits)"
                          value={formData.cardNumber}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').slice(0, 16);
                            const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
                            handleInputChange('cardNumber', formatted);
                          }}
                          maxLength={19}
                          className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                            darkMode 
                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                              : 'bg-white border-gray-300 text-gray-900'
                          } focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 ${
                            formErrors.cardNumber ? 'border-red-500' : ''
                          }`}
                        />
                        {formErrors.cardNumber && <p className="text-red-500 text-sm mt-1">{formErrors.cardNumber}</p>}
                      </div>

                      <div>
                        <input
                          type="text"
                          placeholder="Cardholder Name"
                          value={formData.cardholderName}
                          onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                            darkMode 
                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                              : 'bg-white border-gray-300 text-gray-900'
                          } focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 ${
                            formErrors.cardholderName ? 'border-red-500' : ''
                          }`}
                        />
                        {formErrors.cardholderName && <p className="text-red-500 text-sm mt-1">{formErrors.cardholderName}</p>}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            value={formData.expiryDate}
                            onChange={(e) => {
                              let value = e.target.value.replace(/\D/g, '');
                              if (value.length >= 2) {
                                value = value.slice(0, 2) + '/' + value.slice(2, 4);
                              }
                              handleInputChange('expiryDate', value);
                            }}
                            maxLength={5}
                            className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                              darkMode 
                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                : 'bg-white border-gray-300 text-gray-900'
                            } focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 ${
                              formErrors.expiryDate ? 'border-red-500' : ''
                            }`}
                          />
                          {formErrors.expiryDate && <p className="text-red-500 text-xs mt-1">{formErrors.expiryDate}</p>}
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="CVC"
                            value={formData.cvc}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                              handleInputChange('cvc', value);
                            }}
                            maxLength={4}
                            className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                              darkMode 
                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                : 'bg-white border-gray-300 text-gray-900'
                            } focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 ${
                              formErrors.cvc ? 'border-red-500' : ''
                            }`}
                          />
                          {formErrors.cvc && <p className="text-red-500 text-xs mt-1">{formErrors.cvc}</p>}
                        </div>
                      </div>
                    </div>
                  )}

                  {formData.paymentMethod === 'JazzCash' && (
                    <div className="border-t pt-4">
                      <input
                        type="tel"
                        placeholder="JazzCash Phone Number (e.g., +92 300 1234567)"
                        value={formData.jazzCashPhone}
                        onChange={(e) => handleInputChange('jazzCashPhone', e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 ${
                          formErrors.jazzCashPhone ? 'border-red-500' : ''
                        }`}
                      />
                      {formErrors.jazzCashPhone && <p className="text-red-500 text-sm mt-1">{formErrors.jazzCashPhone}</p>}
                    </div>
                  )}

                  {formData.paymentMethod === 'Easypaisa' && (
                    <div className="border-t pt-4">
                      <input
                        type="tel"
                        placeholder="Easypaisa Phone Number (e.g., +92 300 1234567)"
                        value={formData.easypaisaPhone}
                        onChange={(e) => handleInputChange('easypaisaPhone', e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 ${
                          formErrors.easypaisaPhone ? 'border-red-500' : ''
                        }`}
                      />
                      {formErrors.easypaisaPhone && <p className="text-red-500 text-sm mt-1">{formErrors.easypaisaPhone}</p>}
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 whitespace-nowrap cursor-pointer"
                  >
                    Place Order
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`rounded-2xl p-6 max-w-sm w-full mx-4 ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Remove Item
            </h3>
            <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Are you sure you want to remove this item from your cart?
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
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}