'use client';

import { useState, useEffect } from 'react';
import { getCurrentUser, setCurrentUser, getCartWithDetails } from '@/lib/auth';
import type { User } from '@/lib/auth';
import Image from 'next/image';
import logo from './logo.png';

interface HeaderProps {
  onLogout: () => void;
  onCartClick: () => void;
  darkMode: boolean;
  onDarkModeToggle: () => void;
  showCartButton?: boolean;
}

export default function Header({
  onLogout,
  onCartClick,
  darkMode,
  onDarkModeToggle,
  showCartButton = true,
}: HeaderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);

    const updateCartCount = () => {
      try {
        const cart = getCartWithDetails();
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(totalItems);
      } catch (error) {
        console.error('Error updating cart count:', error);
        setCartCount(0);
      }
    };

    updateCartCount();
    const interval = setInterval(updateCartCount, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    setCurrentUser(null);
    setShowDropdown(false);
    onLogout();
  };

  return (
    <header
      className={`${
        darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
      } border-b transition-colors duration-300`}
    >
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <Image
                src={logo}
                alt="Beguiling Chronos Logo"
                height={40}
                className="w-auto h-20"
                priority
              />
              <h1
                className={`text-2xl font-parisienne ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                Beguiling Chronos
              </h1>
            </div>
            <p
              className={`italic font-pacifico text-sm ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              "Where Time Meets Elegance"
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={onDarkModeToggle}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                darkMode
                  ? 'hover:bg-gray-700 text-white'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <i
                  className={`text-xl ${
                    darkMode ? 'ri-sun-line' : 'ri-moon-line'
                  }`}
                ></i>
              </div>
            </button>

            {showCartButton && (
              <button
                onClick={onCartClick}
                className={`relative p-2 rounded-lg transition-colors cursor-pointer ${
                  darkMode
                    ? 'hover:bg-gray-700 text-white'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <i className="ri-shopping-cart-line text-xl"></i>
                </div>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {user && (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                    darkMode
                      ? 'hover:bg-gray-700 text-white'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <span>{user.username}</span>
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-arrow-down-s-line"></i>
                  </div>
                </button>

                {showDropdown && (
                  <div
                    className={`absolute right-0 top-full mt-2 w-48 rounded-lg shadow-lg border z-50 ${
                      darkMode
                        ? 'bg-gray-800 border-gray-700'
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="py-1">
                      <button
                        onClick={() => setShowDropdown(false)}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer ${
                          darkMode
                            ? 'hover:bg-gray-700 text-gray-300'
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer ${
                          darkMode
                            ? 'hover:bg-gray-700 text-gray-300'
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}