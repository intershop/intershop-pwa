export interface Payment {
  name: string;
  type: string;
  id: string;
  displayName?: string;
  status?: string;
  paymentParameters?: { name: string; type: string; key: string }[];
}
