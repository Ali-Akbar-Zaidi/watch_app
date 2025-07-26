
'use client';

import { useState, useEffect } from 'react';
import { getCurrentUser } from '@/lib/auth';
import type { User } from '@/lib/auth';
import AuthForm from '@/components/AuthForm';
import HomePage from './home/page';
import CheckoutPage from './checkout/page';
// Update the import path to the correct AdminPage component location
// Example: If AdminPage is in components/AdminPage.tsx
import AdminPage from '@/components/AdminPage';



export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<'auth' | 'home' | 'checkout' | 'admin'>('auth');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
      if (user.isAdmin) {
        setCurrentPage('admin');
      } else {
        setCurrentPage('home');
      }
    }
    setIsLoading(false);
  }, []);

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    if (user.isAdmin) {
      setCurrentPage('admin');
    } else {
      setCurrentPage('home');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('auth');
  };

  const handlePageChange = (page: 'home' | 'checkout' | 'admin') => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (currentPage === 'auth') {
    return <AuthForm onAuthSuccess={handleAuthSuccess} />;
  }

  if (currentPage === 'home') {
    return <HomePage onPageChange={handlePageChange} onLogout={handleLogout} />;
  }

  if (currentPage === 'checkout') {
    return <CheckoutPage onPageChange={handlePageChange} onLogout={handleLogout} />;
  }

  if (currentPage === 'admin') {
    return <AdminPage onPageChange={handlePageChange} onLogout={handleLogout} />;
  }

  return null;
}
