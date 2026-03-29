import React from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  options: FilterOption[];
  placeholder?: string;
}

export interface ActiveFilter {
  key: string;
  value: any;
  label: string;
}

type AdvancedFilterSystemProps = {
  searchValue: string;
  searchPlaceholder?: string;
  onSearchChange: (value: string) => void;
  filters?: FilterConfig[];
  activeFilters?: ActiveFilter[];
  onFilterChange?: (key: string, value: string) => void;
  onFilterRemove?: (key: string) => void;
  onClearAllFilters?: () => void;
  action?: React.ReactNode;
  showFilterToggle?: boolean;
};

export const AdvancedFilterSystem: React.FC<AdvancedFilterSystemProps> = ({
  searchValue,
  searchPlaceholder = "Search...",
  onSearchChange,
  filters = [],
  activeFilters = [],
  onFilterChange,
  onFilterRemove,
  onClearAllFilters,
  action,
  showFilterToggle = true,
}) => {
  const [showFilters, setShowFilters] = React.useState(false); 

  const hasActiveFilters = activeFilters.length > 0;

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <div className="flex items-center justify-between gap-4 bg-card p-4 rounded-lg border shadow-sm">
        <div className="flex items-center gap-3 flex-1">
          {/* Search Input */}
          <div className="relative flex-1 max-w-[300px] flex items-center gap-2">
            <Search className="absolute rtl:right-3 ltr:left-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              className="rtl:pr-10 ltr:pl-10"
              value={searchValue ?? ""}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          {/* Filter Toggle Button */}
          {showFilterToggle && filters.length > 0 && (
            <Button
              variant={showFilters ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                  {activeFilters.length}
                </Badge>
              )}
            </Button>
          )}
        </div>

        {/* Action Button */}
        {action && (
          <div className="flex items-center gap-2">
            {action}
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 px-4">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          <div className="flex items-center gap-2 flex-wrap">
            {activeFilters.map((filter) => (
              <Badge
                key={filter.key}
                variant="secondary"
                className="flex items-center gap-1 px-2 py-1"
              >
                <span className="text-xs">{filter.label}</span>
                {onFilterRemove && (
                  <button
                    onClick={() => onFilterRemove(filter.key)}
                    className="ml-1 hover:bg-muted rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </Badge>
            ))}
            {onClearAllFilters && activeFilters.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearAllFilters}
                className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
              >
                Clear all
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Filter Controls */}
      {showFilters && filters.length > 0 && (
        <div className="bg-card p-4 rounded-lg border shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filters.map((filter) => {
              const activeFilter = activeFilters.find(af => af.key === filter.key);
              const filterName = filter.options.find(option => option.value === activeFilter?.value)?.label;
              return (
                <div key={filter.key} className="w-full flex items-center justify-centerx gap-2">
                  <label className="text-sm font-medium text-foreground">
                    {filter.label}
                  </label>
                  <Select
                    value={activeFilter?.value || ""}
                    onValueChange={(value) => {
                      if (onFilterChange) {
                        if (value === "") {
                          onFilterRemove?.(filter.key);
                        } else {
                          onFilterChange(filter.key, value!);
                        }
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue>
                        {filterName || filter.placeholder || `Select ${filter.label.toLowerCase()}`}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className='w-full'>
                    <SelectGroup>
                      <SelectItem value="">All {filter.label.toLowerCase()}</SelectItem>
                      {filter.options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};