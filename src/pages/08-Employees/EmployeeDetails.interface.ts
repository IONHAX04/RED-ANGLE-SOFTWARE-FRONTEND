export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  secondaryMobile?: string;
  doorNo?: string;
  street?: string;
  city: string;
  district: string;
  state: string;
  country: string;
  workLocation?: string;
  salesType?: string;
  availability?: string;
  experience?: string | number;
  skills?: string[];
  portfolio?: string;
  reason?: string;
  createdAt: string;
  createdBy: string;
  updatedAt?: string | null;
  updatedBy?: string | null;
  isActive: string;
  isDelete: string;
}
