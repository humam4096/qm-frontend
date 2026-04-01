import React from 'react';
import {
  FileText,
  Layers,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Hash,
  CheckSquare,
  ListChecks,
  AlignLeft,
  XCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { Form } from '../types';

interface FormDisplayProps {
  data: Form | null;
}

/** ===== CONFIG FOR QUESTION TYPES ===== */
const getQuestionTypeConfig = (type: string) => {
  const map: Record<string, any> = {
    boolean: {
      color: 'text-success',
      bg: 'bg-gradient-to-r from-success/10 to-success/5 border-success/20',
      icon: CheckSquare
    },
    select: {
      color: 'text-primary',
      bg: 'bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20',
      icon: ListChecks
    },
    number: {
      color: 'text-warning',
      bg: 'bg-gradient-to-r from-warning/10 to-warning/5 border-warning/20',
      icon: Hash
    },
    text: {
      color: 'text-muted-foreground',
      bg: 'bg-gradient-to-r from-muted/50 to-muted/25 border-muted',
      icon: AlignLeft
    }
  };
  return map[type] || map.text;
};

const getQuestionTypeLabel = (type: string) => {
  const map: Record<string, string> = {
    boolean: 'Yes / No',
    text: 'Text',
    number: 'Number',
    select: 'Select'
  };
  return map[type] || type;
};

/** ====== HERO CARD ====== */
const FormHero: React.FC<{ data: Form }> = ({ data }) => (
  <div className="relative overflow-hidden bg-linear-to-br from-primary via-primary/90 to-secondary rounded-2xl p-6 text-white shadow-2xl">
    <div className="absolute inset-0 bg-white/5"></div>
    <div className="relative flex gap-6 items-start">
      <div className="w-20 h-20 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center">
        <FileText className="w-10 h-10" />
      </div>

      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-2">{data.name}</h1>
        <p className="text-white/80 mb-4">{data.description}</p>

        <div className="flex flex-wrap gap-2">
          <Badge
            className={cn(
              data.is_active ? 'bg-success text-white' : 'bg-muted text-muted-foreground'
            )}
          >
            {data.is_active ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-1" /> Active
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 mr-1" /> Inactive
              </>
            )}
          </Badge>

          <Badge className="bg-white/20 text-white">{data.form_type}</Badge>
          <Badge className="bg-white/20 text-white">{data.user_role}</Badge>
        </div>
      </div>

      <div className="text-right text-white/80">
        <p>{new Date(data.created_at).toLocaleDateString()}</p>
        <p className="text-sm">{data.created_by?.name}</p>
      </div>
    </div>
  </div>
);

/** ====== METRIC CARD ====== */
const MetricCard: React.FC<{ icon: React.ElementType; label: string; value: string | number; colorClass: string; bgClass: string }> = ({
  icon: Icon,
  label,
  value,
  colorClass,
  bgClass
}) => (
  <Card className={cn(bgClass, 'shadow-lg border-0')}>
    <CardContent className="p-6 flex items-center gap-4">
      <Icon className={cn('w-10 h-10', colorClass)} />
      <div>
        <p className={cn('text-sm', colorClass)}>{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </CardContent>
  </Card>
);

/** ====== QUESTION CARD ====== */
const QuestionCard: React.FC<{ question: any; index: number }> = ({ question, index }) => {
  const config = getQuestionTypeConfig(question.question_type);
  const Icon = config.icon;

  return (
    <Card className={cn('border-2 shadow-lg', config.bg)}>
      <CardHeader className="pb-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-success rounded-lg flex items-center justify-center text-white font-bold text-sm">
            {index + 1}
          </div>

          <div className="flex-1">
            <h4 className={cn('font-semibold text-lg', config.color)}>{question.question}</h4>
            <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
              <Icon className="w-4 h-4" />
              {getQuestionTypeLabel(question.question_type)}
            </p>
          </div>

          {question.is_required && (
            <Badge className="bg-danger/10 text-danger border border-danger/20">Required</Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <Separator />

        <div className="flex flex-wrap gap-2">
          <Badge className="bg-info/10 text-info border border-info/20">Weight: {question.weight}</Badge>
          <Badge className="bg-secondary/10 text-secondary border border-secondary/20">
            Order: {question.sequence_order}
          </Badge>
        </div>

        {question.question_type === 'boolean' && (
          <div className="flex gap-2">
            <Badge className="bg-success/10 text-success border-success/20 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Yes
            </Badge>
            <Badge className="bg-danger/10 text-danger border-danger/20 flex items-center gap-1">
              <XCircle className="w-3 h-3" /> No
            </Badge>
          </div>
        )}

        {question.options?.length > 0 && (
          <div>
            <h6 className="font-medium text-sm text-muted-foreground mb-2">Options</h6>
            <div className="space-y-2">
              {question.options.map((opt: any, idx: number) => (
                <div
                  key={opt.id || idx}
                  className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/10"
                >
                  <div className="flex-1">
                    <span className="font-medium text-primary text-sm">
                      {opt.label || opt.value || `Option ${idx + 1}`}
                    </span>
                    {opt.notes && <p className="text-xs text-muted-foreground mt-1">{opt.notes}</p>}
                  </div>
                  {opt.weight && (
                    <Badge className="bg-primary/10 text-primary border-primary/20">{opt.weight}</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {question.notes && <p className="text-sm text-muted-foreground">{question.notes}</p>}
      </CardContent>
    </Card>
  );
};

/** ====== SECTION CARD ====== */
const SectionCard: React.FC<{ section: any; index: number; total: number }> = ({ section, index, total }) => (
  <div className="relative">
    {/* Header */}
    <div className="flex items-center gap-4 mb-6">
      <div className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center font-bold">
        {index + 1}
      </div>
      <div>
        <h3 className="text-lg font-semibold">{section.title}</h3>
        {section.description && <p className="text-sm text-muted-foreground">{section.description}</p>}
      </div>
    </div>

    {/* Questions */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-12">
      {section.questions.map((q: any, idx: number) => (
        <QuestionCard key={q.id} question={q} index={idx} />
      ))}
    </div>

    {/* Connector */}
    {index < total - 1 && <div className="absolute top-20 left-6 w-0.5 h-16 bg-linear-to-b from-primary/30 to-transparent"></div>}
  </div>
);

/** ====== MAIN COMPONENT ====== */
export const FormDisplay: React.FC<FormDisplayProps> = ({ data }) => {
  if (!data) return null;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <FormHero data={data} />

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard icon={Layers} label="Sections" value={data.sections_count} colorClass="text-primary" bgClass="bg-linear-to-br from-primary/5 to-primary/10" />
        <MetricCard icon={HelpCircle} label="Questions" value={data.questions_count} colorClass="text-secondary" bgClass="bg-linear-to-br from-secondary/5 to-secondary/10" />
        <MetricCard icon={Hash} label="Stage" value={data.inspection_stage?.name || '-'} colorClass="text-warning" bgClass="bg-linear-to-br from-warning/5 to-warning/10" />
      </div>

      {/* Sections */}
      <Card className="shadow-xl border-0">
        <CardContent className="space-y-8 p-6">
          {data.sections.map((section, idx) => (
            <SectionCard key={section.id} section={section} index={idx} total={data.sections.length} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
};