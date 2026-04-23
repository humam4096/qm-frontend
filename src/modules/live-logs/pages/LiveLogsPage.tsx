import { PageHeader } from "@/components/dashboard/PageHeader";
import { useEchoChannel } from "@/hooks/useEchoChannel";
import { useEchoConnection } from "@/hooks/useEchoConnection";
import { useAuthStore } from "@/app/store/useAuthStore";
import { useState, useMemo, useCallback } from "react";

type ComplaintType = {
  id: string;
  name: string;
};

type Kitchen = {
  id: string;
  name: string;
};

type RaisedBy = {
  id: string;
  name: string;
};

type Complaint = {
  id: string;
  description: string;
  status: "open" | "closed" | "pending";
  priority: "low" | "medium" | "high";
  created_at: string;
  resolved_at: string | null;
  resolution_notes: string | null;
  complaint_type: ComplaintType;
  kitchen: Kitchen;
  raised_by: RaisedBy;
};

export const LiveLogsPage = () => {
  const [logs, setLogs] = useState<Complaint[]>([]);
  const [channelError, setChannelError] = useState<string | null>(null);
  const { state, isConnected } = useEchoConnection();
  const { user } = useAuthStore();

  const channelName = useMemo(() => {
    if (!user) return null;

    if (user.role === "system_manager") {
      return "complaints.global";
    }

    if (user.role === "catering_manager" && user.scope?.id) {
      return `complaints.branch.${user.scope.id}`;
    }

    return null;
  }, [user]);

  const handleSubscribed = useCallback(() => {
    setChannelError(null);
  }, []);

  const handleError = useCallback((error: any) => {
    setChannelError(`Failed to subscribe to channel: ${error.message || "Unknown error"}`);
  }, []);

  const handleEventReceived = useCallback((data: Complaint) => {
    setLogs((prev) => [data, ...prev].slice(0, 50));
  }, []);

  const { subscriptionState, isSubscribed } = useEchoChannel<Complaint>(
    channelName || "",
    ".complaint.created",
    handleEventReceived,
    {
      onSubscribed: handleSubscribed,
      onError: handleError,
    }
  );

  const getStatusColor = () => {
    switch (state) {
      case "connected":
        return "bg-green-500";
      case "connecting":
        return "bg-yellow-500";
      case "failed":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = () => {
    switch (state) {
      case "connected":
        return "Connected";
      case "connecting":
        return "Connecting...";
      case "failed":
        return "Connection Failed";
      default:
        return "Disconnected";
    }
  };

  const getSubscriptionStatusColor = () => {
    switch (subscriptionState) {
      case "subscribed":
        return "bg-green-500";
      case "subscribing":
        return "bg-yellow-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getSubscriptionStatusText = () => {
    switch (subscriptionState) {
      case "subscribed":
        return "Subscribed";
      case "subscribing":
        return "Subscribing...";
      case "error":
        return "Subscription Failed";
      default:
        return "Not Subscribed";
    }
  };

  const getPriorityColor = (priority: Complaint["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "low":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    }
  };

  const getStatusColor2 = (status: Complaint["status"]) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "closed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  if (!channelName) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Live Logs"
          description="Real-time activity logs from the system"
        />
        <div className="rounded-lg border bg-card p-4">
          <p className="text-muted-foreground text-sm">
            Live logs are not available for your role.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Live Logs"
        description="Real-time activity logs from the system"
      />

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2 rounded-lg border bg-card p-3">
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${getStatusColor()}`} />
            <span className="text-sm font-medium">{getStatusText()}</span>
          </div>
        </div>

        {isConnected && (
          <div className="rounded-lg border bg-card p-3">
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${getSubscriptionStatusColor()}`} />
              <span className="text-sm font-medium">{getSubscriptionStatusText()}</span>
              {isSubscribed && (
                <span className="text-muted-foreground text-xs">
                  • Channel: {channelName}
                </span>
              )}
            </div>
            {channelError && (
              <p className="mt-2 text-sm text-red-500">{channelError}</p>
            )}
            {subscriptionState === "subscribing" && (
              <p className="text-muted-foreground mt-2 text-xs">
                Waiting for subscription confirmation...
              </p>
            )}
          </div>
        )}
      </div>

      <div className="space-y-3">
        {logs.length === 0 ? (
          <div className="rounded-lg border bg-card p-4">
            <p className="text-muted-foreground text-sm">
              {!isConnected
                ? "Connect to see events"
                : !isSubscribed
                ? "Subscribing to channel..."
                : "Waiting for events..."}
            </p>
          </div>
        ) : (
          logs.map((complaint, index) => (
            <div
              key={`${complaint.id}-${index}`}
              className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm transition-all hover:shadow-md"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-xs font-medium">
                        #{complaint.id}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${getPriorityColor(
                          complaint.priority
                        )}`}
                      >
                        {complaint.priority.toUpperCase()}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor2(
                          complaint.status
                        )}`}
                      >
                        {complaint.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed">{complaint.description}</p>
                  </div>
                  <span className="text-muted-foreground text-xs whitespace-nowrap">
                    {new Date(complaint.created_at).toLocaleString()}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2 border-t pt-3 sm:grid-cols-3">
                  <div>
                    <p className="text-muted-foreground text-xs">Type</p>
                    <p className="text-sm font-medium">{complaint.complaint_type.name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Kitchen</p>
                    <p className="text-sm font-medium">{complaint.kitchen.name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Raised By</p>
                    <p className="text-sm font-medium">{complaint.raised_by.name}</p>
                  </div>
                </div>

                {complaint.status === "closed" && complaint.resolution_notes && (
                  <div className="border-t pt-3">
                    <p className="text-muted-foreground text-xs">Resolution Notes</p>
                    <p className="text-sm">{complaint.resolution_notes}</p>
                    {complaint.resolved_at && (
                      <p className="text-muted-foreground mt-1 text-xs">
                        Resolved: {new Date(complaint.resolved_at).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
