export interface Complaint {
  id: string;
  kitchen_id: number;
  complaint_type_id: string;
  priority: "low" | "medium" | "high" ;
  status: "open" | "in_progress" | "resolved" | "closed";
  description: string;
  resolution_notes: string | null;
  resolved_at: string | null;
  created_at: string;
  kitchen: {
    id: number;
    name: string;
  };
  complaint_type: {
    id: string;
    name: string;
  };
  raised_by: {
    id: number;
    name: string;
    role: string;
  };
  solved_by: {
    id: number;
    name: string;
    role: string;
  } | null;
  attachments: Array<{
    id: string;
    url: string;
    name: string;
  }>;
}