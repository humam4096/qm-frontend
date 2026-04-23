
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useEffect } from "react";
import { createDebugEcho, debugChannel } from "../utils/echo-debug";



export const LiveLogsPageCover = () => {
  // const { data: logs = [], isLoading, error } = useLogs();
  // useLiveLogs();

  useEffect(() => {
    const echo = createDebugEcho();

    debugChannel(echo, "complaints.global");

    return () => {
      echo.leaveChannel("complaints.global");
    };
  }, []);

  // const echoRef = useRef<any>(null);

  // useEffect(() => {
  //   if (echoRef.current) return;
  //   const echo = createDebugEcho();
  //   echoRef.current = echo;
  //   debugChannel(echo, "complaints.globalxx");
  //   return () => {
  //     echo.leaveChannel("complaints.globalxx");
  //   };
  // }, []);
  

  // const { leaveChannel, leave, stopListening, listen } = useEcho(
  //   `complaints.global`, "complaint.created", (e) => {
  //     console.log(e.complaint);
  //   },
  // );

  // listen()
  
  return (
    <div className="space-y-6">
      <PageHeader
        title="Live Logs"
        description="Real-time activity logs from the system"
      />
{/* 
      <LiveLogsList logs={logs} isLoading={isLoading} />
      
      {error && (
        <ErrorMsg message={`Failed to load logs. Please try again later. ${error.message}`} />
      )} */}
    </div>
  );
};

