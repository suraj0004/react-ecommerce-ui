import { useState, useMemo } from 'react';
import { Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Header } from '@/components/header';
import { FilterSidebar } from '@/components/filter-sidebar';
import { ProductGrid } from '@/components/product-grid';
import { Pagination } from '@/components/pagination';
import { LoadingSpinner } from '@/components/loading-spinner';
import { useProducts, useCategories, useFilteredProducts } from '@/hooks/use-products';
import { useCart } from '@/hooks/use-cart';
import { Filters, SortOption } from '@/types/product';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const ITEMS_PER_PAGE = 10;

export default function Home() {
  const [filters, setFilters] = useState<Filters>({
    categories: [],
    priceRange: {},
    search: '',
  });
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: products, isLoading: productsLoading, error: productsError } = useProducts();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const cart = useCart();

  const filteredProducts = useFilteredProducts(products, filters, sortBy);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSearch = (searchTerm: string) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      priceRange: {},
      search: filters.search, // Keep search term
    });
    setCurrentPage(1);
  };

  if (productsError) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header
          cartItemCount={cart.getTotalItems()}
          onCartOpen={cart.openCart}
          onSearch={handleSearch}
          searchTerm={filters.search || ''}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-red-600 text-lg">Failed to load products. Please check your internet connection and try again.</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        cartItemCount={cart.getTotalItems()}
        onCartOpen={cart.openCart}
        onSearch={handleSearch}
        searchTerm={filters.search || ''}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block">
            {categoriesLoading ? (
              <LoadingSpinner />
            ) : (
              <FilterSidebar
                categories={categories || []}
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={clearFilters}
              />
            )}
          </div>

          {/* Mobile Filter Sheet */}
          <div className="lg:hidden mb-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full">
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                {categoriesLoading ? (
                  <LoadingSpinner />
                ) : (
                  <FilterSidebar
                    categories={categories || []}
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                    onClearFilters={clearFilters}
                  />
                )}
              </SheetContent>
            </Sheet>
          </div>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {/* Sort and View Options */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                <span className="text-sm text-slate-600">Sort by:</span>
                <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="name-asc">Name: A-Z</SelectItem>
                    <SelectItem value="name-desc">Name: Z-A</SelectItem>
                    <SelectItem value="rating">Rating: High to Low</SelectItem>
                    <SelectItem value="popularity">Popularity</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-600">View:</span>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="p-2"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="p-2"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Products */}
            {productsLoading ? (
              <LoadingSpinner />
            ) : (
              <>
                <div className="mb-8">
                  <ProductGrid products={paginatedProducts} onAddToCart={cart.addToCart} viewMode={viewMode} />
                </div>

                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filteredProducts.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                  onPageChange={setCurrentPage}
                />
              </>
            )}
          </main>
        </div>
      </div>

      {/* Cart Sheet */}
      <Sheet open={cart.isCartOpen} onOpenChange={cart.closeCart}>
        <SheetContent side="right" className="w-full max-w-md">
          <div className="flex items-center justify-between pb-4 border-b">
            <h2 className="text-lg font-semibold">Shopping Cart ({cart.getTotalItems()})</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto py-4">
            {cart.cartItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-600">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.cartItems.map(({ product, quantity }) => (
                  <div key={product.id} className="flex items-center space-x-4">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-900 line-clamp-1">{product.title}</h4>
                      <p className="text-sm text-slate-600">${product.price.toFixed(2)}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => cart.updateQuantity(product.id, quantity - 1)}
                          className="h-6 w-6 p-0"
                        >
                          -
                        </Button>
                        <span className="text-sm">{quantity}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => cart.updateQuantity(product.id, quantity + 1)}
                          className="h-6 w-6 p-0"
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => cart.removeFromCart(product.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.cartItems.length > 0 && (
            <div className="border-t pt-4 space-y-4">
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>${cart.getTotalPrice().toFixed(2)}</span>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Checkout
              </Button>
              <Button variant="outline" className="w-full" onClick={cart.closeCart}>
                Continue Shopping
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
