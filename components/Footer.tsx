
'use client';

interface FooterProps {
  darkMode: boolean;
}

export default function Footer({ darkMode }: FooterProps) {
  return (
    <footer className={`mt-16 border-t transition-colors duration-300 ${
      darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className={`text-xl font-parisienne mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Beguiling Chronos
            </h3>
            <p className={`italic font-pacifico text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Where Time Meets Elegance
            </p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Discover our exquisite collection of luxury timepieces, carefully curated for those who appreciate the finest craftsmanship and timeless elegance.
            </p>
          </div>

          <div>
            <h4 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              About Us
            </h4>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              At Beguiling Chronos, we believe that a watch is more than just a timepiece it's a statement of style, a symbol of precision, and a testament to craftsmanship. Our carefully curated collection features the finest watches from around the world, each selected for its exceptional quality and timeless appeal.
            </p>
            <p className={`text-sm mt-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Whether you're seeking a classic dress watch for formal occasions, a luxury statement piece, or a vintage timepiece with character, our collection offers something for every discerning taste.
            </p>
          </div>

          <div>
            <h4 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Contact
            </h4>
            <div className="space-y-3">
              <div className={`flex items-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <div className="w-5 h-5 flex items-center justify-center mr-3">
                  <i className="ri-mail-line"></i>
                </div>
                <a href="mailto:beguilingchronos@gmail.com" className="hover:text-amber-600 transition-colors">
                  beguilingchronos@gmail.com
                </a>
              </div>
              <div className={`flex items-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <div className="w-5 h-5 flex items-center justify-center mr-3">
                  <i className="ri-phone-line"></i>
                </div>
                <a href="tel:+923123456789" className="hover:text-amber-600 transition-colors">
                  +92 312-3456789
                </a>
              </div>
              <div className={`flex items-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <div className="w-5 h-5 flex items-center justify-center mr-3">
                  <i className="ri-time-line"></i>
                </div>
                <span>Mon - Sun: 9:00 AM - 10:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        <div className={`mt-8 pt-8 border-t text-center ${
          darkMode ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-600'
        }`}>
          <p className="text-sm">
            © 2025 Beguiling Chronos. All rights reserved. | "Where Time Meets Elegance"
          </p>
        </div>
      </div>
    </footer>
  );
}
