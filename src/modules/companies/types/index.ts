export interface Company {
  id: string;
  name: string;
  registration_number: string;
  contact_phone: string;
  is_active: 1 | 0;
}

export interface Branch {
  id: string;
  companyId: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  managerName: string;
  managerPhone: string;
  location: string;
}
