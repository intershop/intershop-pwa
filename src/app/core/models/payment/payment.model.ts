export interface Payment {
  id: string;
  paymentInstrument: string;
  displayName?: string;
  status?: string;
  description?: string;
}
