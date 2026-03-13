import React from "react";
import { AlertCircle } from "lucide-react";
import type { Company } from "../types";
import { CompanyCard } from "./CompanyCard";
import { CompanyCardSkeleton } from "./CompanyCardSkeleton";

interface CompanyDisplayProps {
  companies: Company[];
  isLoading: boolean;
  error: unknown;
  onEdit: (company: Company) => void;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}

export const CompanyDisplay: React.FC<CompanyDisplayProps> = ({
  companies,
  isLoading,
  error,
  onEdit,
  onView,
  onDelete,
}) => {
  if (error) {
    return (
      <div className="p-4 bg-destructive/10 text-destructive rounded-lg flex items-center gap-3 w-full">
        <AlertCircle className="w-5 h-5" />
        <p>{error instanceof Error ? error.message : "Unexpected error"}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <CompanyCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!companies.length) {
    return (
      <div className="py-10 text-center text-muted-foreground">
        No companies found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {companies.map((company) => (
        <CompanyCard
          key={company.id}
          company={company}
          onOpenEdit={() => onEdit(company)}
          onOpenView={() => onView(company.id)}
          onOpenDelete={() => onDelete(company.id)}
        />
      ))}
    </div>
  );
};