
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useEffect } from "react";
import { createDebugEcho, debugChannel } from "../utils/echo-debug";

export const LiveLogsPage = () => {

  useEffect(() => {
    const echo = createDebugEcho();

    debugChannel(echo, "complaints.global");

    return () => {
      echo.leaveChannel("complaints.global");
    };
  }, []);
  return (
    <div className="space-y-6">
      <PageHeader
        title="Live Logs"
        description="Real-time activity logs from the system"
      />

    </div>
  );
};

