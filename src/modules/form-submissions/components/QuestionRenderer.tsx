import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { FormQuestion } from '@/modules/forms/types';
import type { Answer } from '../types';

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

  // For multi_select now behaves as single choice radio
  const handleMultiSelectChange = (optionId: string) =>
    onChange({ question_id: question.id, selected_options: [optionId] });

  const QuestionCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="border rounded-lg p-4 bg-white shadow-sm space-y-3">
      {children}
    </div>
  );

  switch (question.question_type) {
    case 'text':
      return (
        <QuestionCard>
          <textarea
            className="bg-muted/30 border-none focus-visible:ring-1 min-h-[80px] w-full p-2 rounded"
            value={value?.answer_text || ''}
            onChange={e => handleTextChange(e.target.value)}
            placeholder={t('formSubmissions.enterAnswer')}
          />
        </QuestionCard>
      );

    case 'number':
      return (
        <QuestionCard>
          <input
            type="number"
            className="bg-muted/30 border-none focus-visible:ring-1 w-full p-2 rounded"
            value={value?.answer_number ?? ''}
            onChange={e => handleNumberChange(e.target.value)}
            placeholder={t('formSubmissions.enterNumber')}
          />
        </QuestionCard>
      );

    case 'boolean':
      return (
        <QuestionCard>
          <div className="flex flex-col space-y-2">
            {[t('formSubmissions.yes'), t('formSubmissions.no')].map((label, idx) => (
              <label key={label} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={question.id}
                  checked={value?.answer_boolean === (idx === 0)}
                  onChange={() => handleBooleanChange(idx === 0)}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </QuestionCard>
      );

    case 'single_select':
      return (
        <QuestionCard>
          <div className="flex flex-col space-y-2">
            {question.options.map(opt => (
              <label key={opt.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={question.id}
                  checked={value?.selected_options?.[0] === opt.id}
                  onChange={() => handleSingleSelectChange(opt.id)}
                />
                <span>{opt.option}</span>
              </label>
            ))}
          </div>
        </QuestionCard>
      );

    case 'multi_select':
      return (
        <QuestionCard>
          <div className="flex flex-col space-y-2">
            {question.options.map(opt => (
              <label key={opt.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={question.id}
                  checked={value?.selected_options?.[0] === opt.id}
                  onChange={() => handleMultiSelectChange(opt.id)}
                />
                <span>{opt.option}</span>
              </label>
            ))}
          </div>
        </QuestionCard>
      );

    default:
      return null;
  }
}