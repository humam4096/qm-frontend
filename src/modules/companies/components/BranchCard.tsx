import React from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '../../../components/ui/badge';
import type { Branch } from '../types';

interface BranchCardProps {
  branch: Branch;
  className?: string;
}

export const BranchCard: React.FC<BranchCardProps> = ({ branch, className = '' }) => {
  const { t } = useTranslation();
  
  return (
    <div className={`p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-medium text-foreground">{branch.name}</h4>
          <p className="text-sm text-muted-foreground">{branch.email}</p>
        </div>
        <Badge variant={branch.status === 'active' ? 'default' : 'secondary'}>
          {branch.status === 'active' ? t('companies.active') : t('companies.inactive')}
        </Badge>
      </div>
      <div className="text-sm space-y-1">
        <p><span className="text-muted-foreground">{t('companies.manager')}:</span> <span className="font-medium">{branch.managerName}</span></p>
        <p><span className="text-muted-foreground">{t('companies.contact')}:</span> <span className="font-medium">{branch.managerPhone}</span></p>
      </div>
    </div>
  );
};
