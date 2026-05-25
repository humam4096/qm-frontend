import React from 'react';
import { useTranslation } from "react-i18next";
import type { DailySlot } from "../types";
import { useDailyReportData } from "../hooks/useDailyReportData";
import { DetailedAnalysisSection, ExecutiveSummarySection, HeaderCard, InsightsSection, KeyMetricsSection, RecommendationsSection } from "./report-components/ReportComponents";

interface DailyReportDisplayProps {
  data: DailySlot | null;
}

export const DailyReportDisplay: React.FC<DailyReportDisplayProps> = ({ data }) => {
  const { i18n, t } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // Always call hook before any early return (Rules of Hooks)
  const reportData = useDailyReportData(data as DailySlot);

  if (!data) {
    return (
      <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="rounded-lg border bg-muted/30 p-4">
          <p className="text-sm text-muted-foreground">{t('daily_report.noDataAvailable')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <HeaderCard data={reportData} />
      <ExecutiveSummarySection data={reportData} />
      <KeyMetricsSection data={reportData} />
      <DetailedAnalysisSection data={reportData} />
      <InsightsSection data={reportData} />
      <RecommendationsSection data={reportData} />
    </div>
  );
};