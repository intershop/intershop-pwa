import { PaymentRestrictionData } from '../payment-restriction/payment-restriction.interface';
import { PriceItem } from '../price-item/price-item.interface';

export interface PaymentMethodData {
  id: string;
  displayName: string;
  description?: string;
  restricted?: boolean;
  restrictions?: PaymentRestrictionData[];
  paymentCosts?: PriceItem;
  paymentCostsThreshold?: PriceItem;
}
