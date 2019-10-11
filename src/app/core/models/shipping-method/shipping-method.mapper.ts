import { PriceMapper } from 'ish-core/models/price/price.mapper';

import { ShippingMethodData } from './shipping-method.interface';
import { ShippingMethod } from './shipping-method.model';

export class ShippingMethodMapper {
  static fromData(data: ShippingMethodData): ShippingMethod {
    if (data) {
      return {
        name: data.name,
        id: data.id,
        description: data.description,
        shippingCosts: PriceMapper.fromPriceItem(data.shippingCosts),
        shippingTimeMin:
          data.deliveryTimeMin && data.deliveryTimeMin.match(/^P\d+D$/gi)
            ? +data.deliveryTimeMin.replace(/[PD]/gi, '')
            : undefined,
        shippingTimeMax:
          data.deliveryTimeMax && data.deliveryTimeMax.match(/^P\d+D$/gi)
            ? +data.deliveryTimeMax.replace(/[PD]/gi, '')
            : undefined,
      };
    }
  }
}
