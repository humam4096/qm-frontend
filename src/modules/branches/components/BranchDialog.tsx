import React from "react";
import { useTranslation } from "react-i18next";
import { ActionDialog } from "@/components/ui/action-dialog";
import { BranchCardSkeleton } from "./BranchCardSkeleton";
import { BranchDisplay } from "./BranchDisplay";
import { useGetBranchById } from "../hooks/useBranches";

interface BranchDialogProps {
  open: boolean;
  elId: string | number | null;
  onOpenChange: (open: boolean) => void;
}

export const BranchDialog: React.FC<BranchDialogProps> = ({
  open,
  elId,
  onOpenChange,
}) => {
  const { t } = useTranslation();

  const { data, isLoading, isError, error } = useGetBranchById(elId ?? "");

  const branch = data?.data;

  return (
    <ActionDialog
      isOpen={open}
      onOpenChange={onOpenChange}
      title={t("branches.branchDetails")}
      cancelText={t("common.close")}
      footer={false}
      contentClassName="max-w-3xl"
    >
      {isLoading && (
        <div className="">
          {Array.from({ length: 2 }).map((_, i) => (
            <BranchCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!isLoading && branch && (
        <div className="py-4">
          <BranchDisplay data={branch} />
        </div>
      )}

      {isError && (
        <div className="py-6 text-center text-destructive">
          {error instanceof Error
            ? error.message
            : t("common.unexpectedError")}
        </div>
      )}
    </ActionDialog>
  );
};