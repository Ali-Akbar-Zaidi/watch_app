'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import SearchAndFilter from '@/components/SearchAndFilter';
import ProductGrid from '@/components/ProductGrid';
import Footer from '@/components/Footer';

interface HomePageProps {
  onPageChange: (page: 'home' | 'checkout' | 'admin') => void;
  onLogout: () => void;
}

export default function HomePage({ onPageChange, onLogout }: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  const handleDarkModeToggle = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
  };

  const handleCartClick = () => {
    onPageChange('checkout');
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url('https://readdy.ai/api/search-image?query=luxury%20watch%20collection%20elegant%20display%20with%20sophisticated%20timepieces%20on%20premium%20marble%20surface%2C%20high-end%20jewelry%20photography%20with%20dramatic%20lighting%20and%20rich%20textures%2C%20dark%20ambient%20lighting%20with%20golden%20accents&width=1920&height=1080&seq=8&orientation=landscape')`
      }}
    >
      <Header 
        onLogout={onLogout} 
        onCartClick={handleCartClick}
        darkMode={darkMode}
        onDarkModeToggle={handleDarkModeToggle}
      />
      
      <main className="min-h-screen">
        <div className="relative h-screen flex items-center justify-center">
          <div className="text-center text-white z-10">
            <h1 className="text-6xl md:text-8xl font-parisienne mb-6">
              Beguiling Chronos
            </h1>
            <p className="text-2xl md:text-3xl italic font-pacifico mb-8">
              &quot;Where Time Meets Elegance&quot;
            </p>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto">
              Discover our exquisite collection of luxury timepieces
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-16 bg-black/20 backdrop-blur-sm rounded-t-3xl">
          <SearchAndFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            darkMode={darkMode}
          />

          <ProductGrid
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            darkMode={darkMode}
          />
        </div>
      </main>

      <Footer darkMode={darkMode} />
    </div>
  );
}
