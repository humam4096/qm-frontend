import { useMemo, useCallback, useState } from 'react';
import { Edit, Eye, Plus, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Button } from '@/components/ui/button';
import { useDialogState } from '@/hooks/useDialogState';
import { useAdvancedFilters } from '@/hooks/filter-systerm/useAdvancedFilters';
import { buildActiveFilters } from '@/hooks/filter-systerm/buildActiveFilters';
import { AdvancedFilterSystem } from '@/components/dashboard/AdvancedFilterSystem';
import { cn } from '@/lib/utils';
import type { Form } from '../types';
import { useGetForms, useToggleFormStatus } from '../hooks/useForms';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import { RowActions } from '@/components/ui/row-actions';
import { StatusBadge } from '@/components/ui/status-badge';
import { Badge } from '@/components/ui/badge';
import { FormDialog } from '../components/FormDialog';
import { FormStatsCards } from '../components/FormStatsCards';
import { ActionDialog } from '@/components/ui/action-dialog';
import { toast } from 'sonner';
import { DeleteFormDialog } from '../components/DeleteFormDialog';
import { FormBuilderModal } from '../components/builder/FormBuilderModal';
import { useFormBuilderContext } from '../context/FormBuilderContext';
import { developersAccess, RoleGuard } from '@/app/router/RoleGuard';
import { useAuthStore } from '@/app/store/useAuthStore';
import { useLazyFetchData } from '@/hooks/useLazyFetchData';
import { KitchenAPI } from '@/modules/kitchens/api/kitchens.api';
import { InspectionStageAPI } from '@/modules/inspection-stages/api/inspection-stages.api';
import { FormAPI } from '../api/forms.api';


// A wrapper to inject provider and handle the open state properly
export function FormsPage() {

  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const { user } = useAuthStore();

  
  // dialog state
  const { 
    dialog,
    openView,
    openDelete,
    close
  } = useDialogState<Form>();

  const {
    searchTerm,
    setSearchTerm,
    filters,
    setFilter,
    removeFilter,
    clearFilters,
    page,
    setPage,
    apiFilters
  } = useAdvancedFilters()
  // debounce search
  
  // fetch contracts
  const { data: formsRes, isLoading } = useGetForms(apiFilters);

  const { data: kitchensData } = useLazyFetchData({
    queryKey: ['kitchens-list'],
    queryFn: KitchenAPI.getKitchensList,
    isOpen: isFilterPanelOpen,
  });

  const { data: inspectionStagesData } = useLazyFetchData({
    queryKey: ['inspection-stages-list'],
    queryFn: InspectionStageAPI.getInspectionStagesList,
    isOpen: isFilterPanelOpen,
  });

  const { data: formsData } = useLazyFetchData({
    queryKey: ['formsList'],
    queryFn: FormAPI.getFormsList,
    isOpen: isFilterPanelOpen,
  });
  

  const { mutateAsync: toggleFormStatus, isPending: isToggling, error: toggleError } = useToggleFormStatus();
  const { setIsOpen, setFormId, setCurrentStep } = useFormBuilderContext();

  const allForms = formsRes?.data || [];
  const pagination = formsRes?.pagination;

  // filter configs
  const filterConfigs = useMemo(
    () => [
      {
        key: 'kitchen_id',
        label: t('nav.kitchens'),
        placeholder: t('formSubmissions.selectKitchen'),
        options: (kitchensData?.data || []).map(kitchen => ({
          value: kitchen.id,
          label: kitchen.name,
        }))
      },
      {
        key: 'form_id',
        label: t('nav.forms'),
        placeholder: t('forms.selectForm'),
        options: (formsData?.data || []).map(form => ({
          value: form.id,
          label: form.name,
        }))
      },
      {
        key: 'form_type',
        label: t('formSubmissions.formType'),
        options: [
          { value: 'readiness_assessment', label: t('forms.readinessAssessment') },
          { value: 'report', label: t('forms.report') },
        ],
      },
      {
        key: 'inspection_stage_id',
        label: t('nav.inspectionStages'),
        placeholder: t('inspectionStages.selectInspectionStage'),
        options: (inspectionStagesData?.data || []).map(stage => ({
          value: stage.id,
          label: stage.name,
        }))
      },
      {
        key: 'status',
        label: t('formSubmissions.status'),
        options: [
          { value: 'under_supervisor_review', label: t('formSubmissions.underSupervisorReview') },
          { value: 'under_manager_review', label: t('formSubmissions.underManagerReview') },
          { value: 'submitted', label: t('formSubmissions.submitted') },
          { value: 'approved', label: t('formSubmissions.approved') },
          { value: 'rejected', label: t('formSubmissions.rejected') },
        ],
      },
    ],
    [t, kitchensData, inspectionStagesData, formsData]
  );

  // Table Columns
  const columns = useMemo<ColumnDef<Form>[]>(() => [
    {
      header: '#',
      className: 'w-12 text-center text-muted-foreground font-medium',
      cell: (_, index) => index + 1
    },

    {
      header: t('forms.name'),
      accessorKey: 'name',
      cell: (form) => (
        <div className="font-medium">{form.name}</div>
      )
    },
    {
      header: t('forms.form_type'),
      accessorKey: 'form_type',
      cell: (form) => (
          <Badge variant={'default'}>
          {form.form_type}
        </Badge>
      )
    },
    {
      header: t('forms.user_role'),
      accessorKey: 'user_role',
      cell: (form) => (
        <Badge variant='secondary'>
          {form.user_role}
        </Badge>
      )
    },

    {
      header: t('forms.questionsCount'),
      accessorKey: 'questions_count',
      cell: (form) => (
        <Badge variant="outline">
          {form.questions_count}
        </Badge>
      )
    },

    {
      header: t('forms.status'),
      accessorKey: 'is_active',
      cell: (form) => {
        return (
          <StatusBadge
            onClick={() => {
              setSelectedForm(form);
              setConfirmOpen(true);
            }} 
            status={form.is_active}
            allowedRoles={['system_manager']}
          />
        )
      }
    },

    {
      header: t('forms.actions'),
      className: 'text-left rtl:text-right',
      cell: (form) => (
        <RowActions
          row={form}
          actions={[
            {
              icon: Eye,
              variant: "view",
              onClick: (row) => openView(row),
            },
            {
              icon: Edit,
              variant: "edit",
              onClick: (row) => handleEditForm(row),
              allowedRoles: ['system_manager'],
            },
            {
              icon: Trash2,
              variant: "destructive",
              onClick: (row) => openDelete(row),
              allowedRoles: ['system_manager'],
            }
          ]}
        />
      )
    }

  ], [t, pagination, page]);

  
  // active filters
  const activeFilters = useMemo(() => 
    buildActiveFilters(filters, filterConfigs),
    [filters, filterConfigs]
  )
  
  const handleStateChange = async () => {
    try {
      await toggleFormStatus(selectedForm?.id!);
      setConfirmOpen(false);
      toast.success(t("common.success"));
      
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        t("common.unexpectedError")
      ;
      toast.error(message);
    }
  }

  const handleEditForm = (form: Form) => {
    console.log(form)
    setIsOpen(true);
    // reset form builder after update 
    setFormId(form.id);
    setCurrentStep(1);
  };
  

  // handle page change
  const handlePageChange = useCallback((page: number) => {
    setPage(page);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500" dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* Header */}
      <PageHeader
        title={t('forms.title')}
        description={t('forms.subtitle')}
      />

      {/* Stats Cards */}
      <FormStatsCards
        allForms={allForms}
      />

      {/* Advanced Filter System */}
      <AdvancedFilterSystem
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filterConfigs}
        activeFilters={activeFilters}
        onFilterChange={setFilter}
        onFilterRemove={removeFilter}
        onClearAllFilters={clearFilters}
        onFilterPanelChange={setIsFilterPanelOpen}
          action={
          <RoleGuard allowedRoles={["system_manager"]}>
            { user && developersAccess.includes(user?.email) && 
              <Button className="px-4 md:px-6 hover:bg-primary/80" onClick={() => setIsOpen(true)}>
              <Plus className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
              {t('forms.addForm')}
              </Button>
            }
          </RoleGuard>
        }
      />

      <DataTable
        columns={columns}
        data={allForms}
        isLoading={isLoading}
        currentPage={pagination?.current_page || page}
        totalPages={pagination?.total_pages ?? 0}
        onPageChange={handlePageChange}
        emptyMessage={t('forms.empty')}
      />

      {/* Form Builder Modal */}
      <FormBuilderModal />

      {dialog?.type === 'view' && 
        <FormDialog
        open={dialog?.type === 'view'}
        onOpenChange={(open) => !open && close()}
        form={dialog?.type === 'view' ? dialog.item : null}
      />}

      {/* Delete Contract Dialog */}
      {dialog?.type === 'delete' && 
        <DeleteFormDialog
        open={dialog?.type === 'delete'}
        form={dialog?.type === 'delete' ? dialog.item : null}
        onClose={close}
      />}

      {/* State change comfirmation dialog */}
      {confirmOpen && 
        <ActionDialog
        isOpen={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={t("users.changeStatus")}
        description={t("users.changeStatusConfirm")}
        submitText={t("common.confirm")}
        cancelText={t("common.cancel")}
        onSubmit={handleStateChange}
        isLoading={isToggling}
        footer
        contentClassName="max-w-md"
      >
        <p className="text-muted-foreground">
          {t("users.statusChangeWarning")}
        </p>
        {toggleError && (
          <p className=" text-center text-destructive text-sm">{toggleError?.message}</p>
        )}
      </ActionDialog>}
    </div>

  );
}
