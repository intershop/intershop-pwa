import { AddressMapper } from '../address/address.mapper';
import { BasketItemMapper } from '../basket-item/basket-item.mapper';
import { BasketTotal } from '../basket-total/basket-total.model';
import { BasketData } from '../basket/basket.interface';
import { ShippingBucketData } from '../shipping-bucket/shipping-bucket.interface';

import { Basket } from './basket.model';

export class BasketMapper {
  static fromData(data: BasketData) {
    let shippingBucket: ShippingBucketData;
    if (data.shippingBuckets && data.shippingBuckets.length > 0) {
      shippingBucket = data.shippingBuckets[0];
    }

    const totals: BasketTotal = {
      shippingRebatesTotal: data.totals.basketShippingRebatesTotal,
      total: data.totals.basketTotal,
      valueRebatesTotal: data.totals.basketValueRebatesTotal,
      dutiesAndSurchargesTotal: data.totals.dutiesAndSurchargesTotal,
      itemRebatesTotal: data.totals.itemRebatesTotal,
      itemShippingRebatesTotal: data.totals.itemShippingRebatesTotal,
      itemTotal: data.totals.itemTotal,
      paymentCostsTotal: data.totals.paymentCostsTotal,
      shippingTotal: data.totals.shippingTotal,
      taxTotal: data.totals.taxTotal,
      valueRebates: data.valueRebates,
      itemSurchargeTotalsByType: data.itemSurchargeTotalsByType,
      isEstimated:
        !data.invoiceToAddress || !shippingBucket || !shippingBucket.shipToAddress || !shippingBucket.shippingMethod,
    };

    const basket: Basket = {
      id: data.id,
      purchaseCurrency: data.purchaseCurrency,
      dynamicMessages: data.dynamicMessages,

      invoiceToAddress: data.invoiceToAddress ? AddressMapper.fromData(data.invoiceToAddress) : undefined,
      totals,
    };

    if (shippingBucket) {
      basket.commonShippingMethod = shippingBucket.shippingMethod;
      basket.commonShipToAddress = shippingBucket.shipToAddress
        ? AddressMapper.fromData(shippingBucket.shipToAddress)
        : undefined;
      basket.lineItems = shippingBucket.lineItems.map(item => BasketItemMapper.fromData(item));
    }

    return basket;
  }
}
