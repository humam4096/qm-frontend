import React from "react";
import { Search, X } from "lucide-react";
import { Input } from "../ui/input";
import { RoleGuard } from "@/app/router/RoleGuard";
import { cn } from "@/lib/utils";

type SearchToolbarProps = {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  action?: React.ReactNode;
};

export const SearchToolbar: React.FC<SearchToolbarProps> = ({
  value,
  placeholder = "Search...",
  onChange,
  action,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between gap-4 bg-card p-4 rounded-lg border shadow-sm">
      <div className="relative flex-1 max-w-sm group">
        <div className="absolute rtl:right-2.5 ltr:left-2.5 top-1/2 -translate-y-1/2 transition-colors">
          <Search className="h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary" />
        </div>
        <Input
          placeholder={placeholder}
          className={cn(
            "rtl:pr-9 ltr:pl-9 h-8 text-sm bg-background/50 dark:bg-background/30",
            "border-border/50 focus-visible:border-primary/50",
            "transition-all duration-200",
            "placeholder:text-muted-foreground/60"
          )}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
        {value && (
          <button
            onClick={() => onChange("")}
            className="absolute rtl:left-2.5 ltr:right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      <RoleGuard allowedRoles={['system_manager']}>
        {action && (
          <div className="flex items-center gap-2">
            {action}
          </div>
        )}
      </RoleGuard>
    </div>
  );
};