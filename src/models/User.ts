export interface User {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  id?: string;
  imageUrl?: string | null;
  enabledPay?: boolean | null;
  role?: string;
  publicKey?: string | null;
  paymentIdentifier?: string | null;
  businessId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}