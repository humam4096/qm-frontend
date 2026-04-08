import { useTranslation } from 'react-i18next';
import type { Form } from '@/modules/forms/types';
import type { Answer } from '../types';
import { QuestionRenderer } from './QuestionRenderer';

interface FormRendererProps {
  form: Form;
  answers: Answer[];
  onAnswerChange: (answer: Answer) => void;
}

export function FormRenderer({ form, answers, onAnswerChange }: FormRendererProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Form Header */}
      <div className="rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md transition p-6">
        <h2 className="text-2xl font-semibold">{form?.name}</h2>
        {form?.description && (
          <p className="text-sm text-muted-foreground mt-1">{form?.description}</p>
        )}
        <div className="mt-2 flex gap-4 text-sm text-muted-foreground">
          <span>{t('formSubmissions.type')}: {form?.form_type}</span>
          {form?.inspection_stage?.name && <span>{t('formSubmissions.stage')}: {form.inspection_stage.name}</span>}
          <span>{t('formSubmissions.userRole')}: {form?.user_role}</span>
        </div>
      </div>

      {/* Sections */}
      {form?.sections.map(section => (
        <div
          key={section?.id}
          className="rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md transition p-6 space-y-4"
        >
          <div>
            <h3 className="text-lg font-medium">{section?.title}</h3>
            {section?.description && (
              <p className="text-sm text-muted-foreground mt-1">{section?.description}</p>
            )}
          </div>

          <div className="space-y-4">
            {section?.questions.map(question => {
              const value = answers.find(a => a?.question_id === question?.id);

              return (
                <div key={question?.id} className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-1">
                    {question?.question}
                    {question?.is_required && <span className="text-red-500">*</span>}
                  </label>
                  {question?.notes && (
                    <p className="text-xs text-muted-foreground">{question?.notes}</p>
                  )}

                  <QuestionRenderer
                    question={question}
                    value={value}
                    onChange={onAnswerChange}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
