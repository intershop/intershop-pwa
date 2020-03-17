import { Injectable } from '@angular/core';

import { PriceMapper } from 'ish-core/models/price/price.mapper';

import { ShippingMethodData } from './shipping-method.interface';
import { ShippingMethod } from './shipping-method.model';

@Injectable({ providedIn: 'root' })
export class ShippingMethodMapper {
  constructor(private priceMapper: PriceMapper) {}

  fromData(data: ShippingMethodData): ShippingMethod {
    if (data) {
      return {
        name: data.name,
        id: data.id,
        description: data.description,
        shippingCosts: this.priceMapper.fromPriceItem(data.shippingCosts),
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
