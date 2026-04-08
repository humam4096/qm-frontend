import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, FileText, User, Utensils, Building2, Clock } from 'lucide-react';
import type { FormSubmission } from '../types';

interface FormSubmissionDisplayProps {
  data: FormSubmission | undefined;
}

export function FormSubmissionDisplay({ data }: FormSubmissionDisplayProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  if (!data) return null;

  const statusMap: Record<string, string> = {
    under_supervisor_review: 'warning',
    under_manager_review: 'info',
    approved: 'success',
    rejected: 'destructive',
  };

  const approvalMap: Record<string, string> = {
    pending: 'warning',
    approved: 'success',
    rejected: 'destructive',
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="relative overflow-hidden bg-linear-to-br from-primary via-primary/90 to-secondary rounded-2xl p-6 text-white shadow-2xl">
        <div className="absolute inset-0 bg-white/5" />

        <div className="relative flex items-center gap-5">
          <div className="w-20 h-20 bg-white/10 backdrop-blur border border-white/20 rounded-2xl flex items-center justify-center">
            <FileText className="w-10 h-10" />
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold">{data.form.name}</h1>

            <div className="flex gap-2 mt-3 flex-wrap">
              <Badge
                className="px-4 py-1.5 text-sm"
                variant={statusMap[data.status] as any}
              >
                {t(`formSubmissions.${data.status}`)}
              </Badge>

              <Badge
                className="px-4 py-1.5 text-sm"
                variant={approvalMap[data.branch_approval] as any}
              >
                {t(`formSubmissions.${data.branch_approval}`)}
              </Badge>

              <Badge className="bg-white/20 text-white border-white/30">
                {t('formSubmissions.score')}: {data.score}%
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-linear-to-br from-primary/5 to-primary/10">
          <CardContent className="p-5 flex items-center gap-4">
            <Building2 className="w-8 h-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">{t('formSubmissions.kitchen')}</p>
              <p className="font-bold">{data.kitchen.name}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-linear-to-br from-secondary/5 to-secondary/10">
          <CardContent className="p-5 flex items-center gap-4">
            <Calendar className="w-8 h-8 text-secondary" />
            <div>
              <p className="text-sm text-muted-foreground">{t('formSubmissions.inspectionDate')}</p>
              <p className="font-bold">
                {new Date(data.inspection_date).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-linear-to-br from-warning/5 to-warning/10">
          <CardContent className="p-5 flex items-center gap-4">
            <Clock className="w-8 h-8 text-warning" />
            <div>
              <p className="text-sm text-muted-foreground">{t('formSubmissions.time')}</p>
              <p className="font-bold">{data.time.label}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-linear-to-br from-info/5 to-info/10">
          <CardContent className="p-5 flex items-center gap-4">
            <User className="w-8 h-8 text-info" />
            <div>
              <p className="text-sm text-muted-foreground">{t('formSubmissions.submittedBy')}</p>
              <p className="font-bold">{data.submitted_by.name}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-xl">
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-4">{t('formSubmissions.formDetails')}</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <InfoItem
              icon={FileText}
              label={t('formSubmissions.formType')}
              value={data.form_type}
            />
            <InfoItem
              icon={User}
              label={t('formSubmissions.userRole')}
              value={data.form.user_role}
            />
            {data.form.inspection_stage && (
              <InfoItem
                icon={Utensils}
                label={t('formSubmissions.inspectionStage')}
                value={data.form.inspection_stage.name}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {data.branch_approval_notes && (
        <Card className="border-0 shadow-xl">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-2">{t('formSubmissions.branchApprovalNotes')}</h3>
            <p className="text-muted-foreground">{data.branch_approval_notes}</p>
          </CardContent>
        </Card>
      )}

      {data.status_history.length > 0 && (
        <Card className="border-0 shadow-xl">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4">{t('formSubmissions.statusHistory')}</h3>
            <div className="space-y-3">
              {data.status_history.map((entry, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border">
                  <div>
                    <Badge variant={statusMap[entry.status] as any}>
                      {t(`formSubmissions.${entry.status}`)}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t('formSubmissions.changedBy')}: {entry.changed_by.name}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(entry.changed_at).toLocaleString(isRTL ? 'ar-SA' : 'en-US')}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

const InfoItem = ({ icon: Icon, label, value }: any) => {
  if (!value) return null;
  return (
    <div className="flex items-center gap-3">
      <Icon className="w-5 h-5 text-muted-foreground" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
};
