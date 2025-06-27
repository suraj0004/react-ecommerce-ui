import { useQuery } from '@tanstack/react-query';
import { Product, Filters, SortOption } from '@/types/product';

const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch('https://fakestoreapi.com/products');
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
};

const fetchCategories = async (): Promise<string[]> => {
  const response = await fetch('https://fakestoreapi.com/products/categories');
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  return response.json();
};

export const useProducts = () => {
  return useQuery({
    queryKey: ['/api/products'],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['/api/categories'],
    queryFn: fetchCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useFilteredProducts = (products: Product[] | undefined, filters: Filters, sortBy: SortOption) => {
  if (!products) return [];

  let filtered = [...products];

  // Apply category filter
  if (filters.categories.length > 0) {
    filtered = filtered.filter(product => 
      filters.categories.includes(product.category)
    );
  }

  // Apply price range filter
  if (filters.priceRange.min !== undefined) {
    filtered = filtered.filter(product => product.price >= filters.priceRange.min!);
  }
  if (filters.priceRange.max !== undefined) {
    filtered = filtered.filter(product => product.price <= filters.priceRange.max!);
  }

  // Apply rating filter
  if (filters.rating !== undefined) {
    filtered = filtered.filter(product => product.rating.rate >= filters.rating!);
  }

  // Apply search filter
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filtered = filtered.filter(product => 
      product.title.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
    );
  }

  // Apply sorting
  switch (sortBy) {
    case 'price-asc':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'name-asc':
      filtered.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'name-desc':
      filtered.sort((a, b) => b.title.localeCompare(a.title));
      break;
    case 'rating':
      filtered.sort((a, b) => b.rating.rate - a.rating.rate);
      break;
    case 'popularity':
      filtered.sort((a, b) => b.rating.count - a.rating.count);
      break;
    default:
      // featured - keep original order
      break;
  }

  return filtered;
};
