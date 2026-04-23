export const PriorityBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    low: "bg-green-500/10 text-green-600",
    medium: "bg-yellow-500/10 text-yellow-600",
    high: "bg-red-500/10 text-red-600",
  };
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full ${map[status] || "bg-muted"}`}>
      {status}
    </span>
  );
};