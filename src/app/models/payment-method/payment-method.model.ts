export interface PaymentMethod {
  name: string;
  type: string;
  id: string;
  displayName?: string;
  applicability?: string;
  restrictions?: string[];
}
