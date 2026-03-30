import React from "react";
import { ActionDialog } from "@/components/ui/action-dialog";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useDeleteContract } from "../hooks/useContracts";
import { ErrorMsg } from "@/components/dashboard/ErrorMsg";
import type { Contract } from "../types";

interface DeleteContractDialogProps {
  open: boolean;
  contract: Contract | null;
  onClose: () => void;
}

export const DeleteContractDialog: React.FC<DeleteContractDialogProps> = ({
  open,
  contract,
  onClose,
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const { mutateAsync, isPending, error: mutationError } = useDeleteContract();

  const handleDelete = async () => {
    if (!contract?.id) return;

    try {
      await mutateAsync(contract?.id);

      toast.success(t("contracts.deleteSuccess"));
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
      title={t("contracts.deleteConfirmTitle")}
      isDestructive
      contentClassName="max-w-lg"
      isLoading={isPending}
      footer
    >
      <div className="space-y-4" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="py-2 md:py-4 text-muted-foreground">
          {t("contracts.deleteConfirmDesc")}
        </div>

        {contract && (
          <div className="p-3 md:p-4 bg-muted/50 rounded-lg border">
            <p className="font-medium text-foreground mb-1 truncate">{contract?.name}</p>
            <p className="text-sm text-muted-foreground">
              {t('contracts.kitchen')}: {contract?.kitchen?.name} • {t('contracts.mealType')}: {contract.meal_type === 'buffet' ? t('contracts.buffet') : t('contracts.individual')}
            </p>
          </div>
        )}

      {mutationError && (
        <ErrorMsg message={mutationError?.message} />
      )}

      </div>
    </ActionDialog>
  );
};