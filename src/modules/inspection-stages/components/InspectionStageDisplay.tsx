import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertCircle } from 'lucide-react';
import type { InspectionStage } from '../types';
import { InspectionStageCard } from './InspectionStageCard';
import { InspectionStageCardSkeleton } from './InspectionStageCardSkeleton';
import { ActionDialog } from '@/components/ui/action-dialog';
import { useToggleInspectionStageStatus } from '../hooks/useInspectionStages';
import { toast } from 'sonner';

interface InspectionStageDisplayProps {
  stages: InspectionStage[];
  isLoading: boolean;
  error: unknown;
  onEdit: (stage: InspectionStage) => void;
  onView: (stage: InspectionStage) => void;
  onDelete: (stage: InspectionStage) => void;
}

export const InspectionStageDisplay: React.FC<InspectionStageDisplayProps> = ({
  stages,
  isLoading,
  error,
  onEdit,
  onView,
  onDelete,
}) => {
  const { t } = useTranslation();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState<InspectionStage | null>(null);
  const { mutateAsync: toggleStatus, isPending: stateToggleIsPending } = useToggleInspectionStageStatus();

  const handleStateChange = async () => {
    try {
      await toggleStatus(selectedStage?.id!);
      setConfirmOpen(false);
      toast.success(t('common.success'));
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        t('common.unexpectedError');
      toast.error(message);
    }
  };

  if (error) {
    return (
      <div className="p-4 bg-destructive/10 text-destructive rounded-lg flex items-center gap-3 w-full">
        <AlertCircle className="w-5 h-5" />
        <p>{error instanceof Error ? error.message : 'Unexpected error'}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <InspectionStageCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!stages || stages.length === 0) {
    return (
      <div className="py-10 text-center text-muted-foreground">
        {t('inspectionStages.empty')}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stages.map((stage) => (
          <InspectionStageCard
            key={stage.id}
            stage={stage}
            onOpenEdit={() => onEdit(stage)}
            onOpenView={() => onView(stage)}
            onOpenDelete={() => onDelete(stage)}
            onStatusChange={(stageToChange) => {
              setSelectedStage(stageToChange);
              setConfirmOpen(true);
            }}
          />
        ))}
      </div>

      {/* this is for change active/inactive status of the stage */}
      <ActionDialog
        isOpen={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={t('inspectionStages.changeStatus')}
        description={t('inspectionStages.changeStatusConfirm')}
        submitText={t('common.confirm')}
        cancelText={t('common.cancel')}
        onSubmit={handleStateChange}
        isLoading={stateToggleIsPending}
        footer
        contentClassName="max-w-md"
      >
        <p className="text-muted-foreground">
          {t('inspectionStages.statusChangeWarning')}
        </p>
      </ActionDialog>
    </>
  );
};
