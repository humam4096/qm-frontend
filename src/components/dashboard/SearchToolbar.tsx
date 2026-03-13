import React from "react";
import { Search } from "lucide-react";
import { Input } from "../ui/input";

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
    <div className="flex items-center justify-between gap-4 bg-card p-4 rounded-lg border shadow-sm">
      <div className="relative flex-1 max-w-sm flex items-center gap-2">
        <Search className="absolute rtl:right-3 ltr:left-3 h-4 w-4 text-muted-foreground" />

        <Input
          placeholder={placeholder}
          className="rtl:pr-10 ltr:pl-10"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>

      {action && (
        <div className="flex items-center gap-2">
          {action}
        </div>
      )}
    </div>
  );
};