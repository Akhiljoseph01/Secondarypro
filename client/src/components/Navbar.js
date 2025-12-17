import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-primary-600">SecondaryPro</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              Home
            </Link>
            <Link
              to="/products"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/products') 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              Products
            </Link>
            <a
              href="https://instagram.com/secondarypro"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Instagram
            </a>
            <a
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-600 transition-colors"
            >
              WhatsApp
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary-600 focus:outline-none focus:text-primary-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <Link
                to="/"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/') 
                    ? 'text-primary-600 bg-primary-50' 
                    : 'text-gray-700 hover:text-primary-600'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/products"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/products') 
                    ? 'text-primary-600 bg-primary-50' 
                    : 'text-gray-700 hover:text-primary-600'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Products
              </Link>
              <a
                href="https://instagram.com/secondarypro"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600"
              >
                Instagram
              </a>
              <a
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-3 py-2 rounded-md text-base font-medium bg-green-500 text-white hover:bg-green-600 mx-3"
              >
                WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
