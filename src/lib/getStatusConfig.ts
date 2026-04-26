export const getReviewStatusConfig = (status: string) => {
  switch (status) {
    case "under_supervisor_review":
      return {
        color: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/30",
        icon: "⏳",
        label: "Supervisor Review"
      };
    case "under_quality_manager_review":
      return {
        color: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30",
        icon: "🔍",
        label: "Quality Review"
      };
    case "approved_by_quality_manager":
      return {
        color: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30",
        icon: "✓",
        label: "QM Approved"
      };
    case "submitted":
      return {
        color: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30",
        icon: "✓",
        label: "Submitted"
      };
    case "approved_by_system_manager":
      return {
        color: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30",
        icon: "✓",
        label: "Managerial Approved"
      };
    default:
      return {
        color: "bg-muted text-muted-foreground border-muted",
        icon: "•",
        label: status.replace(/_/g, " ")
      };
  }
};

export const getProgressColor = (progress: number) => {
  if (progress >= 100) return "bg-green-500";
  if (progress >= 75) return "bg-blue-500";
  if (progress >= 50) return "bg-yellow-500";
  if (progress >= 25) return "bg-orange-500";
  return "bg-red-500";
};


export const getApprovalConfig = (approval: string) => {
  switch (approval) {
    case "accepted":
      return {
        color: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30",
        icon: "✓",
        label: "Accepted"
      };
    case "rejected":
      return {
        color: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30",
        icon: "✕",
        label: "Rejected"
      };
    case "pending":
      return {
        color: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/30",
        icon: "⏱",
        label: "Pending"
      };
    default:
      return {
        color: "bg-muted text-muted-foreground border-muted",
        icon: "•",
        label: approval
      };
  }
};


export const getScoreColor = (score: number) => {
  if (score >= 90) return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30";
  if (score >= 75) return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30";
  if (score >= 60) return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/30";
  return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30";
};