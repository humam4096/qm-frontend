import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useFormRunner } from '../context/FormRunnerContext';
import { validateForm, calculateProgress } from '../utils/validation';
import { toast } from 'sonner';
import { FormSubmissionStepLayout } from './FormSubmissionStepLayout';
import { useCreateFormSubmission } from '../hooks/useFormSubmissions';
import { ErrorMsg } from '@/components/dashboard/ErrorMsg';

export function ReviewStep() {
  const { t } = useTranslation();
  const { kitchen_id, day, meal_id, stage_id, forms, answers, resetRunner, setIsOpen } = useFormRunner();
  const { mutateAsync: formSubmissionMutation, error: submissionError, isPending: isSubmitting } = useCreateFormSubmission()
  const handleSubmit = async () => {

    try {
      for (const form of forms) {
        const formAnswers = answers[form.id]?.answers || [];
        await formSubmissionMutation({
          form_id: form.id,
          kitchen_id: kitchen_id!,
          time_id: meal_id!,
          answers: formAnswers,
        });
      }
      toast.success(t('formSubmissions.submitSuccess'));
      resetRunner()
      setIsOpen(false)
    } catch (err) {
      console.error(err);
      toast.error(t('formSubmissions.submitError'));
    }
  };
  
  return (
    <FormSubmissionStepLayout
      title={t('formSubmissions.review')}
      description={t('formSubmissions.reviewDesc')}
      isNextDisabled={isSubmitting}
      isLoading={isSubmitting}
      onNext={handleSubmit}
    >
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">{t('formSubmissions.review')}</h2>

        <Card className="p-6">
          <h3 className="font-medium mb-4">{t('formSubmissions.context')}</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">{t('formSubmissions.kitchen')}:</span>
              <span className="ml-2 font-medium">{kitchen_id || t('formSubmissions.notSelected')}</span>
            </div>
            <div>
              <span className="text-muted-foreground">{t('formSubmissions.day')}:</span>
              <span className="ml-2 font-medium">{day || t('formSubmissions.notSelected')}</span>
            </div>
            <div>
              <span className="text-muted-foreground">{t('formSubmissions.meal')}:</span>
              <span className="ml-2 font-medium">{meal_id || t('formSubmissions.notSelected')}</span>
            </div>
            <div>
              <span className="text-muted-foreground">{t('formSubmissions.stage')}:</span>
              <span className="ml-2 font-medium">{stage_id || t('formSubmissions.notSelected')}</span>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <h3 className="font-medium">{t('formSubmissions.formsSummary')}</h3>
          {forms.map(form => {
            const formAnswers = answers[form.id]?.answers || [];
            const isValid = validateForm(form, formAnswers);
            const progress = calculateProgress(form, formAnswers);

            return (
              <Card key={form.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{form.name}</h4>
                      {isValid ? (
                        <Badge variant="default">{t('formSubmissions.complete')}</Badge>
                      ) : (
                        <Badge variant="destructive">{t('formSubmissions.incomplete')}</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t('formSubmissions.progress')}: {progress}%
                    </p>
                    {!isValid && (
                      <p className="text-sm text-red-500 mt-2">
                        {t('formSubmissions.requiredQuestionsNotAnswered')}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}

          {submissionError && (
            <ErrorMsg message={submissionError?.message} />
          )}
          
        </div>
      </div>
    </FormSubmissionStepLayout>
  );
}
