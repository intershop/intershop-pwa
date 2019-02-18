import { PriceItem } from '../price-item/price-item.interface';

export interface PaymentMethodData {
  id: string;
  displayName: string;
  description?: string;
  applicability?: string;
  paymentCosts?: PriceItem;
  paymentCostsThreshold?: PriceItem;
}
