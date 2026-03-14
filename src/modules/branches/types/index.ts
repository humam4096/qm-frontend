export interface Company {
  id: string;
  name: string;
  registration_number: string;
  contact_phone: string;
  is_active: 1 | 0;
}


export interface Branch {
  id: number;
  name: string;
  contact_email: string;
  contact_phone: string;
  is_active: boolean;
  logo_url: string | null;
  created_at: string;

  company: {
    id: number;
    name: string;
  };
}