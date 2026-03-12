import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { SearchBar } from '../../../components/ui/SearchBar';
import { ActionDialog } from '../../../components/ui/action-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Label } from '../../../components/ui/label';
import { Plus, AlertCircle } from 'lucide-react';
import { api } from '../../../lib/api';
import type { Company, Branch } from '../types';
import { CompanyCard } from '../components/CompanyCard';
import { CompanyCardSkeleton } from '../components/CompanyCardSkeleton';
import { BranchCard } from '../components/BranchCard';
import { BranchCardSkeleton } from '../components/BranchCardSkeleton';

export const CompaniesPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

  // Fetch Companies via React Query
  const { 
    data: companiesData, 
    isLoading: isCompaniesLoading, 
    error: companiesError 
  } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const data = await api.get<Company[]>('/companies');
      return Array.isArray(data) ? data : (data as { data?: Company[] })?.data || [];
    }
  });


  const companies = companiesData || [];

  // Fetch Branches via React Query when a company is selected
  const { 
    data: branchesData, 
    isLoading: isBranchesLoading 
  } = useQuery({
    queryKey: ['branches', selectedCompanyId],
    queryFn: async () => {
      if (!selectedCompanyId) return [];
      const data = await api.get<Branch[]>(`/companies/${selectedCompanyId}/branches`);
      return Array.isArray(data) ? data : (data as { data?: Branch[] })?.data || [];
    },
    enabled: !!selectedCompanyId
  });

  const branches = branchesData || [];

  const handleToggleBranches = (companyId: string) => {
    setSelectedCompanyId(selectedCompanyId === companyId ? null : companyId);
  };

  const filteredCompanies = companies.filter((company: Company) =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2 text-primary">{t('companies.title')}</h2>
          <p className="text-muted-foreground">{t('companies.subtitle')}</p>
        </div>
        <ActionDialog
          trigger={
            <Button>
              <Plus className="w-4 h-4 ms-2" />
              {t('companies.addCompany')}
            </Button>
          }
          title={t('companies.addNewCompany')}
          submitText={t('companies.addCompany')}
          cancelText={t('companies.cancel')}
          onSubmit={() => {
            // Mock submit action
            console.log('Submit added company');
          }}
          contentClassName="max-w-2xl"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('companies.companyName')}</Label>
              <Input placeholder={t('companies.companyName')} />
            </div>
            <div className="space-y-2">
              <Label>{t('companies.managerName')}</Label>
              <Input placeholder={t('companies.managerName')} />
            </div>
            <div className="space-y-2">
              <Label>{t('companies.crNumber')}</Label>
              <Input placeholder="CR-XXXX-XXX" />
            </div>
            <div className="space-y-2">
              <Label>{t('companies.contactNumber')}</Label>
              <Input placeholder="+966XXXXXXXXX" />
            </div>
          </div>
        </ActionDialog>
      </div>

      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder={t('companies.searchPlaceholder')}
      />

      {companiesError ? (
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg flex items-center gap-3 w-full">
           <AlertCircle className="w-5 h-5"/>
           <p>{companiesError instanceof Error ? companiesError.message : 'فصل غير متوقع'}</p>
        </div>
      ) : isCompaniesLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
             <CompanyCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCompanies.map((company: Company) => (
            <CompanyCard 
              key={company.id} 
              company={company} 
              onToggleBranches={handleToggleBranches} 
            />
          ))}
          {filteredCompanies.length === 0 && !isCompaniesLoading && (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              {t('companies.noCompanies')}
            </div>
          )}
        </div>
      )}

      <Dialog 
        open={!!selectedCompanyId} 
        onOpenChange={(open) => {
          if (!open) {
            setSelectedCompanyId(null);
          }
        }}
      >
        <DialogContent className="max-w-4xl" dir={isRTL ? "rtl" : "ltr"}>
          <DialogHeader>
            <DialogTitle>{t('companies.branches')}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
             {isBranchesLoading ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(2)].map((_, i) => (
                        <BranchCardSkeleton key={i} />
                    ))}
                 </div>
             ) : branches.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pl-2">
                {branches.map((branch: Branch) => (
                  <BranchCard key={branch.id} branch={branch} />
                ))}
               </div>
             ) : (
                <div className="py-8 text-center text-muted-foreground">
                    {t('companies.noBranches')}
                </div>
             )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

