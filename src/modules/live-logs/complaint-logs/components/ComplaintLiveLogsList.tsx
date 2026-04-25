// components/LiveLogsList.tsx

import type { Complaint } from "@/modules/complaints/types";
import { ComplaintLogItem } from "./ComplaintLogItem";
import { Skeleton } from "@/components/ui/skeleton";

interface ComplaintLiveLogsListProps {
  logs: Complaint[];
  isLoading: boolean;
  isFailed: boolean;
}

export const ComplaintLiveLogsList = ({ logs, isLoading, isFailed }: ComplaintLiveLogsListProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-2 gap-4">
          {Array.from({ length: 20 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (isFailed) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-muted-foreground">
          <svg
            className="mx-auto h-12 w-12 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-sm font-medium">Failed to connect</p>
          <p className="text-xs mt-1">Please try again later</p>
        </div>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-muted-foreground">
          <svg
            className="mx-auto h-12 w-12 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-sm font-medium">No logs yet</p>
          <p className="text-xs mt-1">Activity logs will appear here in real-time</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-2 gap-4">
      {logs.map((log, index) => (
        <ComplaintLogItem key={log.id} log={log} index={index}/>
      ))}
    </div>
  );
};
