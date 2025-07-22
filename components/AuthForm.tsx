
'use client';

import { useState } from 'react';
import { validatePassword, authenticateUser, saveUser, setCurrentUser } from '@/lib/auth';
import type { User } from '@/lib/auth';

interface AuthFormProps {
  onAuthSuccess: (user: User) => void;
}

export default function AuthForm({ onAuthSuccess }: AuthFormProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErrors([]);
  };

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!formData.email) {
      newErrors.push('Email is required');
    }

    if (!formData.password) {
      newErrors.push('Password is required');
    }

    if (isSignUp) {
      if (!formData.username) {
        newErrors.push('Username is required');
      }

      if (formData.email !== 'admin@gmail.com' && !validatePassword(formData.password)) {
        newErrors.push('Password must be at least 8 characters with uppercase, lowercase, number, and special character');
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.push('Passwords do not match');
      }
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (isSignUp) {
        const newUser: User = {
          id: Date.now().toString(),
          username: formData.username,
          email: formData.email,
          password: formData.password,
          isAdmin: formData.email === 'admin@gmail.com'
        };
        
        saveUser(newUser);
        setCurrentUser(newUser);
        onAuthSuccess(newUser);
      } else {
        const user = authenticateUser(formData.email, formData.password);
        
        if (user) {
          setCurrentUser(user);
          onAuthSuccess(user);
        } else {
          setErrors(['Invalid email or password']);
        }
      }
    } catch (error) {
      setErrors(['An error occurred. Please try again.']);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
         style={{
           backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://readdy.ai/api/search-image?query=luxury%20watch%20collection%20display%20with%20elegant%20timepieces%20on%20dark%20marble%20background%2C%20premium%20jewelry%20store%20interior%20with%20dramatic%20lighting%2C%20sophisticated%20atmosphere&width=1920&height=1080&seq=7&orientation=landscape')`
         }}>
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 w-full max-w-md border border-white/20 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-parisienne text-white mb-2">
            Beguiling Chronos
          </h1>
          <p className="text-white/80 italic text-lg font-pacifico">
            Where Time Meets Elegance
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignUp && (
            <div>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
              />
            </div>
          )}

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
            />
          </div>

          {isSignUp && (
            <div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
              />
            </div>
          )}

          {errors.length > 0 && (
            <div className="space-y-1">
              {errors.map((error, index) => (
                <p key={index} className="text-red-300 text-sm">{error}</p>
              ))}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 whitespace-nowrap cursor-pointer"
          >
            {isLoading ? 'Please wait...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
