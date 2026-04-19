// types/index.ts

export interface Log {
  id: number;
  user_id: number;
  action: string;
  model: string;
  model_id: number | null;
  ip_address: string;
  user_agent: string;
  created_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}
