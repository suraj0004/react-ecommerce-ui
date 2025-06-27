import { useState } from 'react';
import { Link } from 'wouter';
import { Search, ShoppingCart, Menu, X, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  cartItemCount: number;
  onCartOpen: () => void;
  onSearch: (term: string) => void;
  searchTerm: string;
}

export const Header = ({ cartItemCount, onCartOpen, onSearch, searchTerm }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Store className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-2xl font-bold text-blue-600">ShopHub</h1>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link href="/" className="text-slate-900 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                Home
              </Link>
              <Link href="/" className="text-slate-500 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                Products
              </Link>
              <Link href="/" className="text-slate-500 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                Categories
              </Link>
              <Link href="/" className="text-slate-500 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                About
              </Link>
            </div>
          </nav>

          {/* Search and Cart */}
          <div className="flex items-center space-x-4">
            <div className="relative hidden sm:block">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => onSearch(e.target.value)}
                className="w-64 pl-10 pr-4 py-2"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="relative p-2"
              onClick={onCartOpen}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Button>
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/" className="block px-3 py-2 text-base font-medium text-slate-900 hover:text-blue-600">
              Home
            </Link>
            <Link href="/" className="block px-3 py-2 text-base font-medium text-slate-500 hover:text-blue-600">
              Products
            </Link>
            <Link href="/" className="block px-3 py-2 text-base font-medium text-slate-500 hover:text-blue-600">
              Categories
            </Link>
            <Link href="/" className="block px-3 py-2 text-base font-medium text-slate-500 hover:text-blue-600">
              About
            </Link>
            <div className="px-3 py-2">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => onSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
