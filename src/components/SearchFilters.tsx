'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Search, X, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchFiltersProps {
  filters: any;
  updateFilter: (key: string, value: any) => void;
  clearFilters: () => void;
  hasFilters: boolean;
  categories?: { id: string; name: string }[];
  statusOptions?: { value: string; label: string }[];
  showLocation?: boolean;
  showPrice?: boolean;
  showRating?: boolean;
  showStatus?: boolean;
  showDate?: boolean;
  placeholder?: string;
  className?: string;
}

export function SearchFilters({
  filters,
  updateFilter,
  clearFilters,
  hasFilters,
  categories = [],
  statusOptions = [],
  showLocation = true,
  showPrice = true,
  showRating = true,
  showStatus = true,
  showDate = true,
  placeholder = 'Search...',
  className,
}: SearchFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleUpdateFilter = (key: string, value: any) => {
    updateFilter(key, value);
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Main Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder={placeholder}
            value={filters.query || ''}
            onChange={(e) => handleUpdateFilter('query', e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="gap-1"
          >
            <Filter className="h-4 w-4" />
            Filters
            {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </Button>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters */}
      {hasFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.query && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: {filters.query}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleUpdateFilter('query', '')}
              />
            </Badge>
          )}
          {filters.category && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Category: {filters.category}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleUpdateFilter('category', '')}
              />
            </Badge>
          )}
          {filters.location && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Location: {filters.location}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleUpdateFilter('location', '')}
              />
            </Badge>
          )}
          {filters.minPrice && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Min: ${filters.minPrice}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleUpdateFilter('minPrice', '')}
              />
            </Badge>
          )}
          {filters.maxPrice && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Max: ${filters.maxPrice}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleUpdateFilter('maxPrice', '')}
              />
            </Badge>
          )}
          {filters.rating && (
            <Badge variant="secondary" className="flex items-center gap-1">
              ⭐ {filters.rating}+
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleUpdateFilter('rating', '')}
              />
            </Badge>
          )}
          {filters.status && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Status: {filters.status}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleUpdateFilter('status', '')}
              />
            </Badge>
          )}
        </div>
      )}

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="grid grid-cols-1 gap-4 rounded-lg border bg-card p-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={filters.category || ''}
                onChange={(e) => handleUpdateFilter('category', e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Location Filter */}
          {showLocation && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Input
                type="text"
                placeholder="Enter location..."
                value={filters.location || ''}
                onChange={(e) => handleUpdateFilter('location', e.target.value)}
              />
            </div>
          )}

          {/* Price Range Filter */}
          {showPrice && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Price Range</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice || ''}
                  onChange={(e) =>
                    handleUpdateFilter('minPrice', e.target.value ? Number(e.target.value) : '')
                  }
                  className="w-1/2"
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice || ''}
                  onChange={(e) =>
                    handleUpdateFilter('maxPrice', e.target.value ? Number(e.target.value) : '')
                  }
                  className="w-1/2"
                />
              </div>
            </div>
          )}

          {/* Rating Filter */}
          {showRating && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Min Rating</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={filters.rating || ''}
                onChange={(e) =>
                  handleUpdateFilter('rating', e.target.value ? Number(e.target.value) : '')
                }
              >
                <option value="">Any Rating</option>
                <option value="1">⭐ 1+</option>
                <option value="2">⭐ 2+</option>
                <option value="3">⭐ 3+</option>
                <option value="4">⭐ 4+</option>
                <option value="5">⭐ 5</option>
              </select>
            </div>
          )}

          {/* Status Filter */}
          {showStatus && statusOptions.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={filters.status || ''}
                onChange={(e) => handleUpdateFilter('status', e.target.value)}
              >
                <option value="">All Status</option>
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Date Range Filter */}
          {showDate && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={filters.dateFrom || ''}
                  onChange={(e) => handleUpdateFilter('dateFrom', e.target.value)}
                  className="w-1/2"
                />
                <Input
                  type="date"
                  value={filters.dateTo || ''}
                  onChange={(e) => handleUpdateFilter('dateTo', e.target.value)}
                  className="w-1/2"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
