import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const [imageError, setImageError] = useState(false);
  
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/product/${product._id}`}>
        <div className="aspect-w-1 aspect-h-1">
          {imageError ? (
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
              <div className="text-center">
                <div className="text-gray-400 text-4xl mb-2">📷</div>
                <p className="text-gray-500 text-sm">Image not available</p>
              </div>
            </div>
          ) : (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
              onError={handleImageError}
            />
          )}
        </div>
      </Link>
      
      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-primary-600">
            ${product.price}
          </span>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {product.category}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Sizes: {product.sizeRange}
          </span>
          <div className="flex items-center">
            {product.inStock ? (
              <span className="text-green-600 text-sm font-medium">In Stock</span>
            ) : (
              <span className="text-red-600 text-sm font-medium">Out of Stock</span>
            )}
          </div>
        </div>
        
        <Link
          to={`/product/${product._id}`}
          className="mt-4 w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors text-center block font-medium"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
