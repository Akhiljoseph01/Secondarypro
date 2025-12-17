import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productsAPI, ordersAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import PreorderForm from '../components/PreorderForm.jsx';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPreorderForm, setShowPreorderForm] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getById(id);
      setProduct(response.data);
    } catch (err) {
      setError('Product not found');
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePreorderSuccess = () => {
    setShowPreorderForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Link
              to="/products"
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li><Link to="/" className="hover:text-primary-600">Home</Link></li>
            <li><span>/</span></li>
            <li><Link to="/products" className="hover:text-primary-600">Products</Link></li>
            <li><span>/</span></li>
            <li className="text-gray-900">{product.name}</li>
          </ol>
        </nav>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="aspect-w-1 aspect-h-1">
              {imageError ? (
                <div className="w-full h-96 lg:h-full bg-gray-200 flex items-center justify-center rounded-lg">
                  <div className="text-center">
                    <div className="text-gray-400 text-6xl mb-4">📷</div>
                    <p className="text-gray-500">Image not available</p>
                  </div>
                </div>
              ) : (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-96 lg:h-full object-cover rounded-lg"
                  onError={() => setImageError(true)}
                />
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <span className="inline-block bg-primary-100 text-primary-800 text-sm font-medium px-3 py-1 rounded-full mb-2">
                  {product.category}
                </span>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>
                <p className="text-4xl font-bold text-primary-600 mb-4">
                  ${product.price}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Available Sizes</h4>
                  <p className="text-gray-600">{product.sizeRange}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Stock Status</h4>
                  <p className={`font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  onClick={() => setShowPreorderForm(true)}
                  disabled={!product.inStock}
                  className="w-full bg-primary-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {product.inStock ? 'Preorder Now' : 'Out of Stock'}
                </button>

                <div className="flex space-x-4">
                  <a
                    href="https://wa.me/1234567890"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-green-500 text-white py-3 px-4 rounded-lg font-medium text-center hover:bg-green-600 transition-colors"
                  >
                    WhatsApp Us
                  </a>
                  <a
                    href="https://instagram.com/secondarypro"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-pink-500 text-white py-3 px-4 rounded-lg font-medium text-center hover:bg-pink-600 transition-colors"
                  >
                    Instagram
                  </a>
                </div>
              </div>

              {/* Additional Info */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Authentic products from verified Indonesian suppliers</li>
                  <li>• Worldwide shipping available</li>
                  <li>• Quality guaranteed or money back</li>
                  <li>• Customer support via WhatsApp and Instagram</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Preorder Form Modal */}
        {showPreorderForm && (
          <PreorderForm
            product={product}
            onClose={() => setShowPreorderForm(false)}
            onSuccess={handlePreorderSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
