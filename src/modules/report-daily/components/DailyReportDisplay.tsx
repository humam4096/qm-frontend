
interface DailyReportDisplayProps {
  data: DailySlot | null;
}

import { useTranslation } from "react-i18next";
import type { DailySlot } from "../types";
import { useDailyReportData } from "../hooks/useDailyReportData";
import { DetailedAnalysisSection, ExecutiveSummarySection, HeaderCard, InsightsSection, KeyMetricsSection, RecommendationsSection } from "./report-components/ReportComponents";

export const DailyReportDisplay: React.FC<DailyReportDisplayProps> = ({ data }) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  if (!data) {
    return (
      <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="rounded-lg border bg-muted/30 p-4">
          <p className="text-sm text-muted-foreground">No daily slot data available.</p>
        </div>
      </div>
    );
  }

  const reportData = useDailyReportData(data);

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