import { BasketData } from 'ish-core/models/basket/basket.interface';

import { BasketMergeData } from './basket-merge.interface';

/**
 * class is required to transform BasketMergeData into BasketData format
 */
export class BasketMergeHelper {
  // eslint-disable-next-line complexity
  static transform(basketMergeData: BasketMergeData): BasketData {
    return {
      data: basketMergeData.included
        ? basketMergeData.included.targetBasket[basketMergeData.data.targetBasket] || undefined
        : undefined,
      included: basketMergeData.included
        ? {
            invoiceToAddress: basketMergeData.included.targetBasket_invoiceToAddress || undefined,
            lineItems: basketMergeData.included.targetBasket_lineItems || undefined,
            discounts: basketMergeData.included.targetBasket_discounts || undefined,
            lineItems_discounts: basketMergeData.included.targetBasket_lineItems_discounts || undefined,
            lineItems_warranty: basketMergeData.included.targetBasket_lineItems_warranty || undefined,
            commonShipToAddress: basketMergeData.included.targetBasket_commonShipToAddress || undefined,
            commonShippingMethod: basketMergeData.included.targetBasket_commonShippingMethod || undefined,
            payments: basketMergeData.included.targetBasket_payments || undefined,
            payments_paymentMethod: basketMergeData.included.targetBasket_payments_paymentMethod || undefined,
            payments_paymentInstrument: basketMergeData.included.targetBasket_payments_paymentInstrument || undefined,
          }
        : undefined,
    };
  }
}
