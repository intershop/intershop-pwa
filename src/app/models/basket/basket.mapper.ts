import { BasketData } from '../basket/basket.interface';
import { Basket } from './basket.model';

export class BasketMapper {
  static fromData(data: BasketData) {
    const basket: Basket = {
      id: data.id,
      purchaseCurrency: data.purchaseCurrency,
      dynamicMessages: data.dynamicMessages,
      InvoiceToAddress: data.InvoiceToAddress,
      totals: data.totals,
    };

    if (data.shippingBuckets && data.shippingBuckets.length > 0) {
      const shippingBucket = data.shippingBuckets[0];

      basket.commonShippingMethod = shippingBucket.shippingMethod;
      basket.commonShipToAddress = shippingBucket.shipToAddress;
      basket.lineItems = shippingBucket.lineItems;
    }

    return basket;
  }
}
