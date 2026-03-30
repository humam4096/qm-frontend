import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { CheckCircle2, Edit, Eye, Trash2 } from 'lucide-react';
import type { InspectionStage } from '../types';
import { RowActions } from '@/components/ui/row-actions';
import { StatusBadge } from '@/components/ui/status-badge';

interface InspectionStageCardActionsProps {
  stage: InspectionStage;
  openEdit: (stage: InspectionStage) => void;
  openDelete: (stage: InspectionStage) => void;
}

interface InspectionStageCardProps {
  stage: InspectionStage;
  onOpenEdit: (stage: InspectionStage) => void;
  onOpenView: (stage: InspectionStage) => void;
  onOpenDelete: (stage: InspectionStage) => void;
  onStatusChange: (stage: InspectionStage) => void;
}

export const InspectionStageCard: React.FC<InspectionStageCardProps> = ({
  stage,
  onOpenEdit,
  onOpenView,
  onOpenDelete,
  onStatusChange,
}) => {
  const { t } = useTranslation();

  return (
    <Card className="hover:shadow-lg transition-shadow bg-card">
      <CardHeader>
        <div className="flex items-start justify-between">
          <InspectionStageCardHeader stage={stage} />
          <InspectionStageCardActions stage={stage} openEdit={onOpenEdit} openDelete={onOpenDelete} />
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-muted-foreground">{t('inspectionStages.sequenceOrder')}</p>
            <p className="font-medium">{stage.sequence_order}</p>
          </div>
          <div>
            <StatusBadge
              onClick={() => onStatusChange(stage)}
              status={stage.is_active}
              allowedRoles={['system_manager']}
            />
          </div>
        </div>

        <div className="pt-3 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => onOpenView(stage)}
          >
            <Eye className="w-4 h-4 ms-2" />
            {t('inspectionStages.stageDetails')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const InspectionStageCardHeader: React.FC<{ stage: InspectionStage }> = ({ stage }) => (
  <div className="flex items-center gap-3">
    <div className="w-12 h-12 bg-green-600/10 rounded-lg flex items-center justify-center">
      <CheckCircle2 className="w-6 h-6 text-green-600" />
    </div>
    <div>
      <CardTitle className="text-xl text-foreground">{stage.name}</CardTitle>
      <p className="text-sm text-muted-foreground line-clamp-1">{stage.description}</p>
    </div>
  </div>
);

const InspectionStageCardActions: React.FC<InspectionStageCardActionsProps> = ({
  stage,
  openEdit,
  openDelete,
}) => {
  return (
    <RowActions
      row={stage}
      actions={[
        {
          icon: Edit,
          variant: 'edit',
          onClick: openEdit,
          allowedRoles: ['system_manager'],
        },
        {
          icon: Trash2,
          variant: 'destructive',
          onClick: openDelete,
          allowedRoles: ['system_manager'],

        },
      ]}
    />
  );
};
