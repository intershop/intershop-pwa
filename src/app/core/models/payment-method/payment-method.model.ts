import { PaymentRestriction } from '../payment-restriction/payment-restriction.model';
import { Price } from '../price/price.model';

export interface PaymentMethod {
  id: string;
  displayName: string;
  description?: string;
  paymentCosts?: Price;
  paymentCostsThreshold?: Price;
  isRestricted?: boolean;
  restrictionCauses?: PaymentRestriction[];
}
