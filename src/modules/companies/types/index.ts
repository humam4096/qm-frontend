export interface Company {
  id: string;
  name: string;
  registrationNumber: string;
  managerName: string;
  contactNumber: string;
  createdAt: string;
  status: 'active' | 'inactive';
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
