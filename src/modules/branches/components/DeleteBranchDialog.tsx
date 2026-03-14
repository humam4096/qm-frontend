import React from "react";
import { ActionDialog } from "@/components/ui/action-dialog";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useDeleteBranch } from "../hooks/useBranches";

interface DeleteBranchDialogProps {
  open: boolean;
  branchId: string | number | null;
  onClose: () => void;
}

export const DeleteBranchDialog: React.FC<DeleteBranchDialogProps> = ({
  open,
  branchId,
  onClose,
}) => {
  const { t } = useTranslation();

  const { mutateAsync, isPending, error } = useDeleteBranch();

  const handleDelete = async () => {
    if (!branchId) return;

    try {
      await mutateAsync(branchId);

      toast.success(t("branches.deleteSuccess"));
      onClose();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          t("common.unexpectedError")
      );
      console.log(err)
    }
  };

  return (
    <ActionDialog
      isOpen={open}
      onOpenChange={(open) => !open && !isPending && onClose()}
      onSubmit={handleDelete}
      title={t("branches.deleteConfirmTitle")}
      isDestructive
      contentClassName="max-w-lg"
      isLoading={isPending}
      footer
      
    >
      <div className="space-y-4">
        <div className="py-4 text-muted-foreground max-w-sm">
          {t("branches.deleteConfirmDesc")}
        </div>

        {error && (
          <div className="w-full text-destructive text-center">
            {error instanceof Error
              ? error.message
              : t("common.unexpectedError")}
          </div>
        )}
      </div>
    </ActionDialog>
  );
};