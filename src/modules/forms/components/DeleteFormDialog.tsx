import React from "react";
import { ActionDialog } from "@/components/ui/action-dialog";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ErrorMsg } from "@/components/dashboard/ErrorMsg";
import type { Form } from "../types";
import { useDeleteForm } from "../hooks/useForms";

interface DeleteFormDialogProps {
  open: boolean;
  form: Form | null;
  onClose: () => void;
}

export const DeleteFormDialog: React.FC<DeleteFormDialogProps> = ({
  open,
  form,
  onClose,
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const { mutateAsync, isPending, error: mutationError } = useDeleteForm();

  const handleDelete = async () => {
    if (!form?.id) return;

    try {
      await mutateAsync(form?.id);

      toast.success(t("forms.deleteSuccess"));
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
      title={t("forms.deleteConfirmTitle")}
      isDestructive
      contentClassName="max-w-lg"
      isLoading={isPending}
      footer
    >
      <div className="space-y-4" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="py-2 md:py-4 text-muted-foreground">
          {t("forms.deleteConfirmDesc")}
        </div>

        {form && (
          <div className="p-3 md:p-4 bg-muted/50 rounded-lg border">
            <p className="font-medium text-foreground mb-1 truncate">{form?.name}</p>
            <p className="text-sm text-muted-foreground">
              {t('forms.name')}: {form?.name} • {t('forms.form_type')}: {t(`forms.${form.form_type}`)}
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