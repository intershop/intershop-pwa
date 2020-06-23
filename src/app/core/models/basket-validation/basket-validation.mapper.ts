import { BasketData } from 'ish-core/models/basket/basket.interface';
import { BasketMapper } from 'ish-core/models/basket/basket.mapper';

import { BasketValidationData } from './basket-validation.interface';
import { BasketValidation } from './basket-validation.model';

export class BasketValidationMapper {
  static fromData(data: BasketValidationData): BasketValidation {
    if (data) {
      return {
        basket: BasketMapper.fromData(BasketValidationMapper.transform(data)),
        results: {
          valid: data.data.results && data.data.results.valid,
          adjusted: data.data.results && data.data.results.adjusted,
          errors: data.data.results && data.data.results.errors,
          infos: data.data.results && data.data.results.infos,
        },
        scopes: data.data.scopes,
      };
    }
  }

  private static transform(basketValidationData: BasketValidationData): BasketData {
    return {
      data: basketValidationData.included
        ? basketValidationData.included.basket[basketValidationData.data.basket]
          ? basketValidationData.included.basket[basketValidationData.data.basket]
          : undefined
        : undefined,
      included: basketValidationData.included
        ? {
            invoiceToAddress: basketValidationData.included.basket_invoiceToAddress
              ? basketValidationData.included.basket_invoiceToAddress
              : undefined,

            lineItems: basketValidationData.included.basket_lineItems
              ? basketValidationData.included.basket_lineItems
              : undefined,
            discounts: basketValidationData.included.basket_discounts
              ? basketValidationData.included.basket_discounts
              : undefined,
            lineItems_discounts: basketValidationData.included.basket_lineItems_discounts
              ? basketValidationData.included.basket_lineItems_discounts
              : undefined,
            commonShipToAddress: basketValidationData.included.basket_commonShipToAddress
              ? basketValidationData.included.basket_commonShipToAddress
              : undefined,
            commonShippingMethod: basketValidationData.included.basket_commonShippingMethod
              ? basketValidationData.included.basket_commonShippingMethod
              : undefined,
            payments: basketValidationData.included.basket_payments
              ? basketValidationData.included.basket_payments
              : undefined,
            payments_paymentMethod: basketValidationData.included.basket_payments_paymentMethod
              ? basketValidationData.included.basket_payments_paymentMethod
              : undefined,
            payments_paymentInstrument: basketValidationData.included.basket_payments_paymentInstrument
              ? basketValidationData.included.basket_payments_paymentInstrument
              : undefined,
          }
        : undefined,
    };
  }
}
