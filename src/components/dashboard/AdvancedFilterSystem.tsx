import React from "react";
import { Search, X, ChevronDown, SlidersHorizontal } from "lucide-react";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

export interface FilterOption {
  value: string | number;
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
    <div className="space-y-2">
      {/* Main Search and Filter Bar - Compact */}
      <div className="bg-linear-to-br from-card via-card to-card/95 backdrop-blur-sm rounded-lg border border-border/50 shadow-md shadow-black/5 dark:shadow-black/20 overflow-hidden">
        <div className="flex flex-col md:flex-row items-centerx justify-between gap-3 px-3 py-2.5">
          <div className="flex items-center gap-2 flex-1">
            {/* Compact Search Input */}
            <div className="relative flex-1 max-w-sm group">
              <div className="absolute rtl:right-2.5 ltr:left-2.5 top-1/2 -translate-y-1/2 transition-colors">
                <Search className="h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary" />
              </div>
              <Input
                placeholder={searchPlaceholder}
                className={cn(
                  "rtl:pr-9 ltr:pl-9 h-8 text-sm bg-background/50 dark:bg-background/30",
                  "border-border/50 focus-visible:border-primary/50",
                  "transition-all duration-200",
                  "placeholder:text-muted-foreground/60"
                )}
                value={searchValue ?? ""}
                onChange={(e) => onSearchChange(e.target.value)}
              />
              {searchValue && (
                <button
                  onClick={() => onSearchChange("")}
                  className="absolute rtl:left-2.5 ltr:right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Compact Filter Toggle Button */}
            {showFilterToggle && filters.length > 0 && (
              <Button
                variant={showFilters ? "default" : "outline"}
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "hidden md:flex items-center gap-1.5 h-8 px-3 transition-all duration-200",
                  showFilters && "shadow-sm shadow-primary/20",
                  !showFilters && "hover:border-primary/30"
                )}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span className="font-medium">Filters</span>
                {hasActiveFilters && (
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      "ml-0.5 px-1.5 py-0 font-semibold rounded-full h-4 flex items-center",
                      showFilters 
                        ? "bg-primary-foreground/20 text-primary-foreground" 
                        : "bg-primary/10 text-primary"
                    )}
                  >
                    {activeFilters.length}
                  </Badge>
                )}
                <ChevronDown 
                  className={cn(
                    "h-3 w-3 transition-transform duration-200",
                    showFilters && "rotate-180"
                  )} 
                />
              </Button>
            )}

            {/* Inline Active Filters - Compact */}
            {hasActiveFilters && (
              <div className="flex items-center gap-1.5 flex-1 overflow-x-auto scrollbar-thin">
                {activeFilters.map((filter) => (
                  <Badge
                    key={filter.key}
                    variant="secondary"
                    className={cn(
                      "flex items-center gap-1 px-2 py-0.5 rounded-full shrink-0",
                      "bg-primary/10 text-primary border border-primary/20",
                      "hover:bg-primary/20 transition-colors duration-200"
                    )}
                  >
                    <span className="text-[11px] font-medium">{filter.label}</span>
                    {onFilterRemove && (
                      <button
                        onClick={() => onFilterRemove(filter.key)}
                        className="hover:bg-primary/30 rounded-full p-0.5 transition-colors"
                        aria-label={`Remove ${filter.label} filter`}
                      >
                        <X className="h-2.5 w-2.5" />
                      </button>
                    )}
                  </Badge>
                ))}
                {onClearAllFilters && activeFilters.length > 1 && (
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={onClearAllFilters}
                    className="h-6 px-2 text-[11px] shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    Clear
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Action Button */}
          {action && (
            <div className="flex items-center">
              {action}
            </div>
          )}
        </div>
      </div>

      {/* Filter Controls - Compact Collapsible Panel */}
      {showFilters && filters.length > 0 && (
        <div 
          className={cn(
            "bg-linear-to-br from-card via-card to-card/95",
            "rounded-lg border border-border/50 shadow-md shadow-black/5 dark:shadow-black/20",
            "overflow-hidden animate-in slide-in-from-top-2 duration-200"
          )}
        >
          <div className="p-3">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {filters.map((filter) => {
                const activeFilter = activeFilters.find(af => af.key === filter.key);
                const filterName = filter.options.find(option => option.value === activeFilter?.value)?.label;
                const isActive = !!activeFilter;
                
                return (
                  <div 
                    key={filter.key} 
                    className={cn(
                      "flex flex-col gap-1.5 p-2 rounded-md border transition-all duration-200",
                      isActive 
                        ? "bg-primary/5 border-primary/30" 
                        : "bg-background/50 dark:bg-background/30 border-border/50 hover:border-border"
                    )}
                  >
                    <label className="text-[10px] font-semibold text-foreground/80 uppercase tracking-wide">
                      {filter.label}
                    </label>
                    <Select
                      value={activeFilter?.value?.toString() || ""}
                      onValueChange={(value) => {
                        if (onFilterChange) {
                          if (value === "") {
                            onFilterRemove?.(filter.key);
                          } else {
                            onFilterChange(filter.key, value);
                          }
                        }
                      }}
                    >
                      <SelectTrigger 
                        className={cn(
                          "w-full h-7 bg-background/80 dark:bg-background/50",
                          isActive && "border-primary/50 ring-1 ring-primary/10"
                        )}
                      >
                        <SelectValue>
                          {filterName || filter.placeholder || `Select ${filter.label.toLowerCase()}`}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="w-full">
                        <SelectGroup className='w-full'>
                          <SelectItem 
                            value="" 
                            className="text-muted-foreground italic "
                          >
                            All {filter.label.toLowerCase()}
                          </SelectItem>
                          {filter.options.map((option) => (
                            <SelectItem 
                              key={option.value} 
                              value={option.value.toString()}
                              className=""
                            >
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
        </div>
      )}
    </div>
  );
};