import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
import type { Company } from "../types";
import { CompanyCard } from "./CompanyCard";
import { CompanyCardSkeleton } from "./CompanyCardSkeleton";
import { ActionDialog } from "@/components/ui/action-dialog";
import { useToggleCompanyStatus } from "../hooks/useCompay";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface CompanyDisplayProps {
  companies: Company[];
  isLoading: boolean;
  error: unknown;
  onEdit: (company: Company) => void;
  onView: (company: Company) => void;
  onDelete: (company: Company) => void;
}

export const CompanyDisplay: React.FC<CompanyDisplayProps> = ({
  companies,
  isLoading,
  error,
  onEdit,
  onView,
  onDelete,
}) => {
  const { t } = useTranslation();

  // change state comfirmation
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const {mutateAsync: toggleCompanyStatus, isPending: stateToggleIsPending} = useToggleCompanyStatus();
  
  const handleStateChange = async () => {
    try {
      await toggleCompanyStatus(selectedCompany?.id!);
      setConfirmOpen(false);
      toast.success(t("common.success"));
      
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        t("common.unexpectedError")
      ;
      toast.error(message);
    }
  }

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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
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
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company) => (
          <CompanyCard
            key={company.id}
            company={company}
            onOpenEdit={() => onEdit(company)}
            onOpenView={() => onView(company)}
            onOpenDelete={() => onDelete(company)}
            onStatusChange={(companyToChange) => {
              setSelectedCompany(companyToChange);
              setConfirmOpen(true);
            }}
          />
      ))}

      </div>
      {/* State change comfirmation dialog */}
      <ActionDialog
        isOpen={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={t("branches.changeStatus")}
        description={t("branches.changeStatusConfirm")}
        submitText={t("common.confirm")}
        cancelText={t("common.cancel")}
        onSubmit={handleStateChange}
        isLoading={stateToggleIsPending}
        footer
        contentClassName="max-w-md"
      >
        <p className="text-muted-foreground">
          {t("branches.statusChangeWarning")}
        </p>
      </ActionDialog>
    </>
  );
};