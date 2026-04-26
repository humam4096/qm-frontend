import { useTranslation } from 'react-i18next';
import type { FormQuestion } from '@/modules/forms/types';
import type { Answer } from '../types';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface QuestionRendererProps {
  question: FormQuestion;
  value: Answer | undefined;
  onChange: (answer: Answer) => void;
}

export function QuestionRenderer({ question, value, onChange }: QuestionRendererProps) {
  const { t } = useTranslation();

  const handleTextChange = (text: string) =>
    onChange({ question_id: question.id, answer_text: text });

  const handleNumberChange = (num: string) =>
    onChange({ question_id: question.id, answer_number: num ? parseFloat(num) : undefined });

  const handleBooleanChange = (checked: boolean) =>
    onChange({ question_id: question.id, answer_boolean: checked });

  const handleSingleSelectChange = (optionId: string) =>
    onChange({ question_id: question.id, selected_options: [optionId] });

  const handleMultiSelectChange = (optionId: string) => {
    const currentSelections = value?.selected_options || [];
    const isSelected = currentSelections.includes(optionId);
    
    const updatedSelections = isSelected
      ? currentSelections.filter(id => id !== optionId)
      : [...currentSelections, optionId];
    
    onChange({ question_id: question.id, selected_options: updatedSelections });
  };

  switch (question.question_type) {
    case 'text':
      return (
        <div className="relative">
          <textarea
            className={cn(
              "w-full min-h-[100px] md:min-h-[120px] p-3 md:p-4 rounded-lg",
              "bg-background/80 dark:bg-background/50 border-2 border-border/50",
              "focus:border-primary/50 focus:ring-2 focus:ring-primary/10",
              "transition-all duration-200 resize-y",
              "text-sm md:text-base text-foreground placeholder:text-muted-foreground/60",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
            value={value?.answer_text || ''}
            onChange={e => handleTextChange(e.target.value)}
            placeholder={t('formSubmissions.enterAnswer')}
          />
          {value?.answer_text && value.answer_text.trim() !== '' && (
            <div className="absolute top-3 right-3 p-1 rounded-full bg-primary/10">
              <Check className="h-3.5 w-3.5 text-primary" />
            </div>
          )}
        </div>
      );

    case 'number':
      return (
        <div className="relative max-w-xs">
          <input
            type="number"
            className={cn(
              "w-full h-11 md:h-12 px-3 md:px-4 rounded-lg",
              "bg-background/80 dark:bg-background/50 border-2 border-border/50",
              "focus:border-primary/50 focus:ring-2 focus:ring-primary/10",
              "transition-all duration-200",
              "text-sm md:text-base text-foreground placeholder:text-muted-foreground/60",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
            value={value?.answer_number ?? ''}
            onChange={e => handleNumberChange(e.target.value)}
            placeholder={t('formSubmissions.enterNumber')}
          />
          {value?.answer_number !== undefined && value?.answer_number !== null && (
            <div className="absolute top-1/2 -translate-y-1/2 right-3 p-1 rounded-full bg-primary/10">
              <Check className="h-3.5 w-3.5 text-primary" />
            </div>
          )}
        </div>
      );

    case 'boolean':
      return (
        <div className="flex flex-col sm:flex-row gap-2.5">
          {[
            { label: t('formSubmissions.yes'), value: true },
            { label: t('formSubmissions.no'), value: false }
          ].map(({ label, value: boolValue }) => {
            const isSelected = value?.answer_boolean === boolValue;
            
            return (
              <label 
                key={String(boolValue)} 
                className={cn(
                  "flex items-center gap-2.5 p-3 md:p-3.5 rounded-lg border cursor-pointer transition-all duration-200 flex-1",
                  isSelected
                    ? "bg-primary/[0.06] border-primary/30"
                    : "bg-background border-border/40 hover:border-border/60 hover:bg-muted/30"
                )}
              >
                <div className={cn(
                  "relative flex items-center justify-center w-4 h-4 rounded-full border-2 transition-all shrink-0",
                  isSelected 
                    ? "border-primary bg-primary" 
                    : "border-muted-foreground/40"
                )}>
                  {isSelected && (
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                  )}
                </div>
                <input
                  type="radio"
                  name={question.id}
                  checked={isSelected}
                  onChange={() => handleBooleanChange(boolValue)}
                  className="sr-only"
                />
                <span className={cn(
                  "text-sm md:text-base transition-colors",
                  isSelected ? "text-foreground font-medium" : "text-muted-foreground"
                )}>
                  {label}
                </span>
                {isSelected && (
                  <Check className="h-3.5 w-3.5 text-primary/70 ml-auto shrink-0" />
                )}
              </label>
            );
          })}
        </div>
      );

    case 'single_select':
      return (
        <div className="flex flex-col gap-2">
          {question.options && question.options.length > 0 ? (
            question.options.map(opt => {
              const isSelected = value?.selected_options?.[0] === opt.id;
              
              return (
                <label 
                  key={opt.id} 
                  className={cn(
                    "flex items-center gap-2.5 p-3 md:p-3.5 rounded-lg border cursor-pointer transition-all duration-200",
                    isSelected
                      ? "bg-primary/[0.06] border-primary/30"
                      : "bg-background border-border/40 hover:border-border/60 hover:bg-muted/30"
                  )}
                >
                  <div className={cn(
                    "relative flex items-center justify-center w-4 h-4 rounded-full border-2 transition-all shrink-0",
                    isSelected 
                      ? "border-primary bg-primary" 
                      : "border-muted-foreground/40"
                  )}>
                    {isSelected && (
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                    )}
                  </div>
                  <input
                    type="radio"
                    name={question.id}
                    checked={isSelected}
                    onChange={() => handleSingleSelectChange(opt.id)}
                    className="sr-only"
                  />
                  <span className={cn(
                    "text-sm md:text-base transition-colors flex-1",
                    isSelected ? "text-foreground font-medium" : "text-muted-foreground"
                  )}>
                    {opt.option}
                  </span>
                  {isSelected && (
                    <Check className="h-3.5 w-3.5 text-primary/70 shrink-0" />
                  )}
                </label>
              );
            })
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground bg-muted/30 rounded-lg border border-border/50">
              {t('formSubmissions.noOptionsAvailable')}
            </div>
          )}
        </div>
      );

    case 'multi_select':
      return (
        <div className="flex flex-col gap-2">
          {question.options && question.options.length > 0 ? (
            question.options.map(opt => {
              const isChecked = value?.selected_options?.includes(opt.id) || false;
              
              return (
                <label 
                  key={opt.id} 
                  className={cn(
                    "flex items-center gap-2.5 p-3 md:p-3.5 rounded-lg border cursor-pointer transition-all duration-200",
                    isChecked
                      ? "bg-primary/[0.06] border-primary/30"
                      : "bg-background border-border/40 hover:border-border/60 hover:bg-muted/30"
                  )}
                >
                  <div className={cn(
                    "relative flex items-center justify-center w-4 h-4 rounded border-2 transition-all shrink-0",
                    isChecked 
                      ? "border-primary bg-primary" 
                      : "border-muted-foreground/40"
                  )}>
                    {isChecked && (
                      <Check className="h-3 w-3 text-primary-foreground" />
                    )}
                  </div>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleMultiSelectChange(opt.id)}
                    className="sr-only"
                  />
                  <span className={cn(
                    "text-sm md:text-base transition-colors flex-1",
                    isChecked ? "text-foreground font-medium" : "text-muted-foreground"
                  )}>
                    {opt.option}
                  </span>
                  {isChecked && (
                    <Check className="h-3.5 w-3.5 text-primary/70 shrink-0" />
                  )}
                </label>
              );
            })
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground bg-muted/30 rounded-lg border border-border/50">
              {t('formSubmissions.noOptionsAvailable')}
            </div>
          )}
        </div>
      );

    default:
      return (
        <div className="p-4 text-center text-sm text-muted-foreground bg-muted/30 rounded-lg border border-border/50">
          {t('formSubmissions.unsupportedQuestionType')}
        </div>
      );
  }
}