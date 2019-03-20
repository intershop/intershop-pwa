import { PriceMapper } from '../price/price.mapper';

import { PaymentMethodData } from './payment-method.interface';
import { PaymentMethod } from './payment-method.model';

export class PaymentMethodMapper {
  static fromData(data: PaymentMethodData): PaymentMethod {
    if (data) {
      return {
        id: data.id,
        displayName: data.displayName,
        description: data.description,
        isRestricted: data.restricted,
        restrictionCauses: data.restrictions,
        paymentCosts: PriceMapper.fromPriceItem(data.paymentCosts, 'net'),
        paymentCostsThreshold: PriceMapper.fromPriceItem(data.paymentCostsThreshold, 'net'),
      };
    }
  }
}
