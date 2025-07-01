import { Product } from '@/types/product';
import { ProductCard } from './product-card';
import { Button } from './ui/button';
import { Star } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  viewMode: 'grid' | 'list';
}

export const ProductGrid = ({ products, onAddToCart, viewMode }: ProductGridProps) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 text-lg">No products found matching your filters.</p>
        <p className="text-slate-500 text-sm mt-2">Try adjusting your search criteria or clearing filters.</p>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <img
                src={product.image}
                alt={product.title}
                className="w-full sm:w-24 h-48 sm:h-24 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">{product.title}</h3>
                <p className="text-slate-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating.rate)
                            ? 'text-yellow-400 fill-current'
                            : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-slate-600">({product.rating.count})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-slate-900">${product.price.toFixed(2)}</span>
                  <Button onClick={() => onAddToCart(product)} className="bg-blue-600 hover:bg-blue-700">
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};
