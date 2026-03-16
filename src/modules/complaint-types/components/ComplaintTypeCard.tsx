import React from 'react';
import { Card } from '@/components/ui/card';
import { RowActions } from '@/components/ui/row-actions';
import type { ComplaintType } from '../types';
import { Edit, Eye, Trash2 } from 'lucide-react';
import { StatusBadge } from '@/components/ui/status-badge';

interface ComplaintTypeCardProps {
  complaintType: ComplaintType;
  onEdit: (item: ComplaintType) => void;
  onView: (item: ComplaintType) => void;
  onDelete: (item: ComplaintType) => void;
  onStatusChange?: (item: ComplaintType) => void;
}

export const ComplaintTypeCard: React.FC<ComplaintTypeCardProps> = ({
  complaintType,
  onEdit,
  onView,
  onDelete,
  onStatusChange,
}) => {

  return (
    <Card className="p-4 space-y-3 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base truncate">{complaintType?.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {complaintType?.description}
          </p>
        </div>
        
        <RowActions
          row={complaintType}
          actions={[
            {
              icon: Eye,
              variant: 'view',
              onClick: onView,
            },
            {
              icon: Edit,
              variant: 'edit',
              onClick: onEdit,
            },
            {
              icon: Trash2,
              variant: 'destructive',
              onClick: (row) => onDelete(row),
            },
          ]}
        />
      </div>

      <div className="flex justify-between items-center pt-2 border-t">
        <span className="text-xs text-muted-foreground">
          {new Date(complaintType?.created_at).toLocaleDateString()}
        </span>
        <StatusBadge
          onClick={() => onStatusChange?.(complaintType)}
          status={complaintType.is_active}
        />
      </div>
    </Card>
  );
};
