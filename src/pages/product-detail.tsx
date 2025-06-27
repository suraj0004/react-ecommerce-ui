import { useState } from 'react';
import { useParams, Link } from 'wouter';
import { ArrowLeft, Heart, Share2, ShoppingCart, Plus, Minus, Check } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/loading-spinner';
import { useCart } from '@/hooks/use-cart';
import { Product } from '@/types/product';

const fetchProduct = async (id: string): Promise<Product> => {
  const response = await fetch(`https://fakestoreapi.com/products/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch product');
  }
  return response.json();
};

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const cart = useCart();

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['/api/products', id],
    queryFn: () => fetchProduct(id!),
    enabled: !!id,
  });

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  const handleAddToCart = () => {
    if (product) {
      cart.addToCart(product, quantity);
      // Could add a toast notification here
    }
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    return (
      <span className="text-amber-400 text-lg">
        {'★'.repeat(fullStars)}
        {hasHalfStar && '☆'}
        {'☆'.repeat(5 - fullStars - (hasHalfStar ? 1 : 0))}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">Failed to load product details.</p>
          <Link href="/">
            <Button variant="outline">Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Mock additional images for demo - in real app would come from API
  const productImages = [
    product.image,
    product.image, // Would be different angles
    product.image,
  ];

  const features = [
    'High quality materials',
    'Durable construction',
    'Fast shipping',
    'Customer satisfaction guaranteed',
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </Link>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Product Images */}
            <div>
              <img
                src={productImages[selectedImage]}
                alt={product.title}
                className="w-full h-96 object-cover rounded-lg mb-4"
              />
              <div className="flex space-x-2">
                {productImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.title} view ${index + 1}`}
                    className={`w-16 h-16 object-cover rounded border-2 cursor-pointer transition-colors ${
                      selectedImage === index ? 'border-blue-500' : 'border-slate-200'
                    }`}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-4">{product.title}</h1>
              
              <div className="flex items-center mb-4">
                {renderStars(product.rating.rate)}
                <span className="ml-2 text-slate-600">({product.rating.count} reviews)</span>
              </div>

              <div className="flex items-center space-x-3 mb-6">
                <span className="text-3xl font-bold text-slate-900">${product.price.toFixed(2)}</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  In Stock
                </Badge>
              </div>

              <p className="text-slate-600 mb-6 leading-relaxed">
                {product.description}
              </p>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Quantity</label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 border border-slate-300 rounded-md min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 mb-6">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 font-medium"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" className="p-3">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="p-3">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Product Features */}
              <div className="border-t border-slate-200 pt-6">
                <h3 className="font-semibold text-slate-900 mb-3">Product Features</h3>
                <ul className="space-y-2">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-slate-600">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Category Badge */}
              <div className="mt-6">
                <Badge variant="outline" className="capitalize">
                  {product.category}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
