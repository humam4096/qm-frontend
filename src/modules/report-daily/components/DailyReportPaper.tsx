import React from 'react';
import { useTranslation } from 'react-i18next';
import type { DailySlot } from '../types';
import { useDailyReportData } from '../hooks/useDailyReportData';
import {
  HeaderCard,
  ExecutiveSummarySection,
  KeyMetricsSection,
  DetailedAnalysisSection,
  InsightsSection,
  RecommendationsSection,
} from './report-components/ReportComponents';
import '../../../styles/print.css';

interface DailyReportPaperProps {
  data: DailySlot | null;
}

/**
 * Print-optimized color fixes for export
 * Ensures consistent rendering across screen and print
 */
const DAILY_REPORT_EXPORT_COLOR_FIXES = `
  .daily-report-paper-export .bg-muted\\/30 { background-color: rgba(238, 236, 224, 0.3) !important; }
  .daily-report-paper-export .bg-muted\\/20 { background-color: rgba(238, 236, 224, 0.2) !important; }
  .daily-report-paper-export .bg-muted\\/10 { background-color: rgba(238, 236, 224, 0.1) !important; }
  
  /* Print-safe borders */
  .daily-report-paper-export .border { border-color: #e5e5e5 !important; }
  
  /* Ensure proper spacing in print */
  .daily-report-paper-export .print-section { margin-bottom: 1.5rem; }
  
  /* Prevent orphaned headers */
  .daily-report-paper-export .section-title { 
    page-break-after: avoid;
    break-after: avoid;
  }
  
  /* Adjust text sizes for print */
  .daily-report-paper-export .metric-card p:last-child {
    font-size: 1rem !important;
  }
  
  /* Submission cards in print */
  .daily-report-paper-export .submission-card {
    padding: 0.5rem !important;
  }
  
  .daily-report-paper-export .submission-card p {
    font-size: 0.75rem !important;
  }
`;

export const DailyReportPaper: React.FC<DailyReportPaperProps> = ({ data }) => {
  const { i18n, t } = useTranslation();
  const isRTL = i18n.language === 'ar';

  if (!data) {
    return (
      <div className="daily-report-paper-export space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
        <style>{DAILY_REPORT_EXPORT_COLOR_FIXES}</style>
        <div className="rounded-lg border bg-muted/30 p-4">
          <p className="text-sm text-muted-foreground">{t('daily_report.noDataAvailable')}</p>
        </div>
      </div>
    );
  }

  const reportData = useDailyReportData(data);

  return (
    <div className="daily-report-paper-export print-container" dir={isRTL ? 'rtl' : 'ltr'}>
      <style>{DAILY_REPORT_EXPORT_COLOR_FIXES}</style>
      
      {/* Page 1: Header, Executive Summary, Key Metrics */}
      <div className="print-page space-y-6" style={{ maxWidth: '794px', margin: '0 auto', padding: '20px' }}>
        <HeaderCard data={reportData} variant="print" />
        <ExecutiveSummarySection data={reportData} variant="print" />
        <KeyMetricsSection data={reportData} variant="print" />
      </div>

      {/* Page 2: Detailed Analysis, Insights, Recommendations */}
      <div className="print-page space-y-6" style={{ maxWidth: '794px', margin: '0 auto', padding: '20px' }}>
        <DetailedAnalysisSection data={reportData} variant="print" />
        <InsightsSection data={reportData} variant="print" />
        <RecommendationsSection data={reportData} variant="print" />
      </div>

      {/* Footer with page info */}
      <div className="print-only mt-8 pt-4 border-t text-center">
        <p className="text-xs text-muted-foreground">
          {t('daily_report.generatedBy')} • {new Date().toLocaleString(isRTL ? 'ar-SA' : 'en-US')} • {t('daily_report.confidential')}
        </p>
      </div>
    </div>
  );
};
