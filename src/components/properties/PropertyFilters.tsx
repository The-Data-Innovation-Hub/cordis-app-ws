import { useState } from 'react';
import { PropertyFilters as PropertyFiltersType } from '@/types/property';
import { Search, Filter, ChevronDown, ChevronUp, DollarSign } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface PropertyFiltersProps {
  filters: PropertyFiltersType;
  onFilterChange: (updates: Partial<PropertyFiltersType>) => void;
  onSearch: () => void;
}

export default function PropertyFilters({ filters, onFilterChange, onSearch }: PropertyFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange({ [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              name="search"
              placeholder="Search by address, city, or ZIP..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50"
              value={filters.search}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex justify-between items-center">
            <Button 
              type="button"
              variant="ghost" 
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
            >
              <Filter className="h-4 w-4" />
              {showFilters ? (
                <>
                  <span>Hide Filters</span>
                  <ChevronUp className="h-4 w-4 ml-1" />
                </>
              ) : (
                <>
                  <span>Show Filters</span>
                  <ChevronDown className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
            
            <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700">
              Search
            </Button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-sm"
                  value={filters.status}
                  onChange={handleInputChange}
                >
                  <option value="">All Status</option>
                  <option value="Available">Available</option>
                  <option value="Rented">Rented</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Sold">Sold</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="number"
                    name="minPrice"
                    placeholder="Min"
                    className="w-full pl-8 pr-3 py-2 bg-gray-50"
                    value={filters.minPrice}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="number"
                    name="maxPrice"
                    placeholder="Max"
                    className="w-full pl-8 pr-3 py-2 bg-gray-50"
                    value={filters.maxPrice}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                <select
                  name="bedrooms"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-sm"
                  value={filters.bedrooms}
                  onChange={handleInputChange}
                >
                  <option value="">Any Beds</option>
                  <option value="1">1+ Beds</option>
                  <option value="2">2+ Beds</option>
                  <option value="3">3+ Beds</option>
                  <option value="4">4+ Beds</option>
                  <option value="5">5+ Beds</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
