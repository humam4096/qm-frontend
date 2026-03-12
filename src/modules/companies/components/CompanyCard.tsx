import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Building2, Edit, Eye, Trash2 } from 'lucide-react';
import type { Company } from '../types';
import { ActionDialog } from '../../../components/ui/action-dialog';

interface CompanyCardProps {
  company: Company;
  onToggleBranches: (companyId: string) => void;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({ company, onToggleBranches }) => {
  const { t } = useTranslation();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsDeleting(false);
    setIsDeleteOpen(false);
  };

  const handleEdit = async () => {
    setIsEditing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsEditing(false);
    setIsEditOpen(false);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow bg-card">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl text-foreground">{company.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{company.registrationNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <ActionDialog
              isOpen={isEditOpen}
              onOpenChange={setIsEditOpen}
              trigger={
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <Edit className="w-4 h-4" />
                </Button>
              }
              title={t('companies.editCompany')}
              submitText={t('companies.saveChanges')}
              cancelText={t('companies.cancel')}
              onSubmit={handleEdit}
              isLoading={isEditing}
              contentClassName="max-w-2xl"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('companies.companyName')}</Label>
                  <Input defaultValue={company.name} />
                </div>
                <div className="space-y-2">
                  <Label>{t('companies.managerName')}</Label>
                  <Input defaultValue={company.managerName} />
                </div>
                <div className="space-y-2">
                  <Label>{t('companies.contactNumber')}</Label>
                  <Input defaultValue={company.contactNumber} />
                </div>
              </div>
            </ActionDialog>

            <ActionDialog
              isOpen={isDeleteOpen}
              onOpenChange={setIsDeleteOpen}
              trigger={
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              }
              title={t('companies.deleteCompany')}
              description={t('companies.deleteConfirmation', { name: company.name })}
              submitText={t('companies.delete')}
              cancelText={t('companies.cancel')}
              isDestructive={true}
              onSubmit={handleDelete}
              isLoading={isDeleting}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground">{t('companies.manager')}</p>
            <p className="font-medium">{company.managerName}</p>
          </div>
          <div>
            <p className="text-muted-foreground">{t('companies.contact')}</p>
            <p className="font-medium">{company.contactNumber}</p>
          </div>
        </div>
        <div className="pt-3 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => onToggleBranches(company.id)}
          >
            <Eye className="w-4 h-4 ms-2" />
            {t('companies.showBranches')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
