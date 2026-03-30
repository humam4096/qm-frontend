import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Building2, Edit, Eye, Trash2 } from 'lucide-react';
import type { Company } from '../types';
import { RowActions } from '@/components/ui/row-actions';
import { StatusBadge } from '@/components/ui/status-badge';



interface CompanyCardActionsProps {
  company: Company;
  openEdit: (company: Company) => void;
  openDelete: (id: string) => void;
}

interface CompanyCardProps {
  company: Company;
  onOpenEdit: (company: Company) => void;
  onOpenView: (id: string) => void;
  onOpenDelete: (id: string) => void;
  onStatusChange: (company: Company) => void;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({ company, onOpenEdit, onOpenView, onOpenDelete, onStatusChange }) => {
  const { t } = useTranslation();

  return (
    <Card className="hover:shadow-lg transition-shadow bg-card">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CompanyCardHeader company={company} />
          <CompanyCardActions company={company} openEdit={onOpenEdit} openDelete={onOpenDelete} />
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-muted-foreground">{t('companies.contact')}</p>
            <p className="font-medium">{company.contact_phone}</p>
          </div>
          <div>
            <StatusBadge
              onClick={() => onStatusChange(company)} 
              status={company.is_active}
              allowedRoles={['system_manager']}
            />
          </div>
        </div>

        <div className="pt-3 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => onOpenView(company.id)}
            // disabled
          >
            <Eye className="w-4 h-4 ms-2" />
            {t('companies.details')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const CompanyCardHeader: React.FC<{ company: Company }> = ({ company }) => (
  <div className="flex items-center gap-3">
    <div className="w-12 h-12 bg-blue-600/10 rounded-lg flex items-center justify-center">
      <Building2 className="w-6 h-6 text-blue-600" />
    </div>
    <div>
      <CardTitle className="text-xl text-foreground">{company.name}</CardTitle>
      <p className="text-sm text-muted-foreground">{company.registration_number}</p>
    </div>
  </div>
);

const CompanyCardActions: React.FC<CompanyCardActionsProps> = ({ company, openEdit, openDelete }) => {
  return (
    <RowActions
      row={company}
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
          onClick: (row) => openDelete(row.id),
          allowedRoles: ['system_manager'],

        },
      ]}
    />
  );
};