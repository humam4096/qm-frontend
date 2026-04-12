import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetFormSubmissionById } from "@/modules/form-submissions/hooks/useFormSubmissions";
import { FormSubmissionDisplay } from "@/modules/form-submissions/components/FormSubmissionDisplay";
import { FormSubmissionSkeleton } from "@/modules/form-submissions/components/FormSubmissionSkeleton";
import { ActionDialog } from "@/components/ui/action-dialog";
import { useTranslation } from "react-i18next";

interface NotificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formSubmissionId: string | null;
}

export const NotificationDialog = ({
  open,
  onOpenChange,
  formSubmissionId,
}: NotificationDialogProps) => {

  const {t} = useTranslation();
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetFormSubmissionById(formSubmissionId || "");

  // Don't render if no ID
  if (!formSubmissionId) {
    return null;
  }

  return (
    <ActionDialog
      isOpen={open}
      onOpenChange={onOpenChange}
      cancelText={t("common.close")}
      footer={false}
      contentClassName="max-w-5xl max-h-[95vh] overflow-y-auto"
    >
      {isLoading && (
        <div className="py-4">
          <FormSubmissionSkeleton />
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center justify-center p-8 gap-4">
          <AlertCircle className="h-12 w-12 text-muted-foreground" />
          <div className="text-center">
            <p className="text-sm font-medium">Failed to load form submission</p>
            <p className="text-xs text-muted-foreground">
            {error?.message || "Please try again"}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    )}

    {!isLoading && !isError && data?.data && (
      <div className="py-2">
        <FormSubmissionDisplay data={data.data} />
      </div>
    )}
    </ActionDialog>

  );
};
