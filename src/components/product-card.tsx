import { Heart, ShoppingCart } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    return (
      <span className="text-amber-400 text-sm">
        {'★'.repeat(fullStars)}
        {hasHalfStar && '☆'}
        {'☆'.repeat(5 - fullStars - (hasHalfStar ? 1 : 0))}
      </span>
    );
  };

  const getBadgeInfo = () => {
    if (product.rating.rate >= 4.5) return { text: 'Popular', variant: 'default' as const };
    if (product.price < 50) return { text: 'Sale', variant: 'destructive' as const };
    if (product.rating.count > 100) return { text: 'Bestseller', variant: 'secondary' as const };
    return null;
  };

  const badgeInfo = getBadgeInfo();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="relative">
        <Link href={`/product/${product.id}`}>
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-48 object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
          />
        </Link>
        <div className="absolute top-2 right-2">
          <Button variant="ghost" size="sm" className="p-2 bg-white rounded-full shadow-sm hover:bg-red-50">
            <Heart className="h-4 w-4 text-slate-400 hover:text-red-500" />
          </Button>
        </div>
        {badgeInfo && (
          <div className="absolute top-2 left-2">
            <Badge variant={badgeInfo.variant} className="text-xs font-medium">
              {badgeInfo.text}
            </Badge>
          </div>
        )}
      </div>
      <div className="p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold text-slate-900 mb-1 line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors">
            {product.title}
          </h3>
        </Link>
        <p className="text-sm text-slate-600 mb-2 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center mb-2">
          <div className="flex">
            {renderStars(product.rating.rate)}
          </div>
          <span className="ml-1 text-xs text-slate-500">({product.rating.count})</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-slate-900">${product.price.toFixed(2)}</span>
          </div>
          <Button
            onClick={() => onAddToCart(product)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium"
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};
