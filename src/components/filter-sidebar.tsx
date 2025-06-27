import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Filters } from '@/types/product';

interface FilterSidebarProps {
  categories: string[];
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onClearFilters: () => void;
}

export const FilterSidebar = ({ categories, filters, onFiltersChange, onClearFilters }: FilterSidebarProps) => {
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(false);
  const [ratingOpen, setRatingOpen] = useState(false);

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, category]
      : filters.categories.filter(c => c !== category);
    
    onFiltersChange({
      ...filters,
      categories: newCategories,
    });
  };

  const handlePriceRangeChange = (min?: number, max?: number) => {
    onFiltersChange({
      ...filters,
      priceRange: { min, max },
    });
  };

  const handleRatingChange = (rating?: number) => {
    onFiltersChange({
      ...filters,
      rating,
    });
  };

  const getCategoryCount = (category: string) => {
    // Mock category counts - in real app would come from API
    const counts: Record<string, number> = {
      "men's clothing": 4,
      "women's clothing": 6,
      "jewelery": 4,
      "electronics": 6,
    };
    return counts[category] || 0;
  };

  return (
    <aside className="lg:col-span-1">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear All
          </Button>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <Collapsible open={categoryOpen} onOpenChange={setCategoryOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-left">
              <span className="font-medium text-slate-900">Category</span>
              {categoryOpen ? (
                <ChevronUp className="h-4 w-4 text-slate-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-slate-400" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3">
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center justify-between">
                    <Label className="flex items-center cursor-pointer">
                      <Checkbox
                        checked={filters.categories.includes(category)}
                        onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                        className="mr-2"
                      />
                      <span className="text-sm text-slate-700 capitalize">{category}</span>
                    </Label>
                    <span className="text-xs text-slate-500">({getCategoryCount(category)})</span>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Price Range Filter */}
        <div className="mb-6">
          <Collapsible open={priceOpen} onOpenChange={setPriceOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-left">
              <span className="font-medium text-slate-900">Price Range</span>
              {priceOpen ? (
                <ChevronUp className="h-4 w-4 text-slate-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-slate-400" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3">
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.priceRange.min || ''}
                    onChange={(e) => handlePriceRangeChange(Number(e.target.value) || undefined, filters.priceRange.max)}
                    className="w-full"
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.priceRange.max || ''}
                    onChange={(e) => handlePriceRangeChange(filters.priceRange.min, Number(e.target.value) || undefined)}
                    className="w-full"
                  />
                </div>
                <RadioGroup
                  value={filters.priceRange.min && filters.priceRange.max ? `${filters.priceRange.min}-${filters.priceRange.max}` : ''}
                  onValueChange={(value) => {
                    if (value === 'under-25') handlePriceRangeChange(0, 25);
                    else if (value === '25-50') handlePriceRangeChange(25, 50);
                    else if (value === '50-100') handlePriceRangeChange(50, 100);
                    else if (value === 'over-100') handlePriceRangeChange(100, undefined);
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="under-25" id="under-25" />
                    <Label htmlFor="under-25" className="text-sm text-slate-700">Under $25</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="25-50" id="25-50" />
                    <Label htmlFor="25-50" className="text-sm text-slate-700">$25 - $50</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="50-100" id="50-100" />
                    <Label htmlFor="50-100" className="text-sm text-slate-700">$50 - $100</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="over-100" id="over-100" />
                    <Label htmlFor="over-100" className="text-sm text-slate-700">Over $100</Label>
                  </div>
                </RadioGroup>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Rating Filter */}
        <div className="mb-6">
          <Collapsible open={ratingOpen} onOpenChange={setRatingOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-left">
              <span className="font-medium text-slate-900">Rating</span>
              {ratingOpen ? (
                <ChevronUp className="h-4 w-4 text-slate-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-slate-400" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3">
              <div className="space-y-2">
                {[5, 4, 3].map((rating) => (
                  <Label key={rating} className="flex items-center cursor-pointer">
                    <Checkbox
                      checked={filters.rating === rating}
                      onCheckedChange={(checked) => handleRatingChange(checked ? rating : undefined)}
                      className="mr-2"
                    />
                    <span className="flex items-center">
                      <span className="text-amber-400">
                        {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
                      </span>
                      <span className="ml-1 text-sm text-slate-700">({rating}.0{rating < 5 ? '+' : ''})</span>
                    </span>
                  </Label>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </aside>
  );
};
