import { BasketTotal } from '../basket-total/basket-total.model';
import { BasketData } from '../basket/basket.interface';
import { ShippingBucket } from '../shipping-bucket/shipping-bucket.model';

import { Basket } from './basket.model';

export class BasketMapper {
  static fromData(data: BasketData) {
    let shippingBucket: ShippingBucket;
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
      invoiceToAddress: data.invoiceToAddress,
      totals,
    };

    if (shippingBucket) {
      basket.commonShippingMethod = shippingBucket.shippingMethod;
      basket.commonShipToAddress = shippingBucket.shipToAddress;
      basket.lineItems = shippingBucket.lineItems;
    }

    return basket;
  }
}
