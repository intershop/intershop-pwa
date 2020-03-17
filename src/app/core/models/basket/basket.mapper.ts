import { Injectable } from '@angular/core';

import { AddressMapper } from 'ish-core/models/address/address.mapper';
import { BasketTotalMapper } from 'ish-core/models/basket-total/basket-total.mapper';
import { BasketData } from 'ish-core/models/basket/basket.interface';
import { LineItemMapper } from 'ish-core/models/line-item/line-item.mapper';
import { PaymentMapper } from 'ish-core/models/payment/payment.mapper';
import { ShippingMethodMapper } from 'ish-core/models/shipping-method/shipping-method.mapper';

import { Basket } from './basket.model';

@Injectable({ providedIn: 'root' })
export class BasketMapper {
  constructor(
    private basketTotalMapper: BasketTotalMapper,
    private lineItemMapper: LineItemMapper,
    private shippingMethodMapper: ShippingMethodMapper
  ) {}

  fromData(payload: BasketData): Basket {
    const { data, included, infos } = payload;

    const totals = data.calculated
      ? this.basketTotalMapper.getTotals(data, included ? included.discounts : undefined)
      : undefined;
    if (totals) {
      totals.isEstimated = !data.invoiceToAddress || !data.commonShipToAddress || !data.commonShippingMethod;
    }

    return {
      id: data.id,
      bucketId: data.buckets && data.buckets.length === 1 && data.buckets[0],
      purchaseCurrency: data.purchaseCurrency,
      dynamicMessages: data.discounts ? data.discounts.dynamicMessages : undefined,
      invoiceToAddress:
        included && included.invoiceToAddress && data.invoiceToAddress
          ? AddressMapper.fromData(included.invoiceToAddress[data.invoiceToAddress])
          : undefined,
      commonShipToAddress:
        included && included.commonShipToAddress && data.commonShipToAddress
          ? AddressMapper.fromData(included.commonShipToAddress[data.commonShipToAddress])
          : undefined,
      commonShippingMethod:
        included && included.commonShippingMethod && data.commonShippingMethod
          ? this.shippingMethodMapper.fromData(included.commonShippingMethod[data.commonShippingMethod])
          : undefined,
      lineItems:
        included && included.lineItems && data.lineItems && data.lineItems.length
          ? data.lineItems.map(lineItemId =>
              this.lineItemMapper.fromData(included.lineItems[lineItemId], included.lineItems_discounts)
            )
          : [],
      totalProductQuantity: data.totalProductQuantity,
      payment:
        included && included.payments && data.payments && data.payments.length && included.payments[data.payments[0]]
          ? PaymentMapper.fromIncludeData(
              included.payments[data.payments[0]],
              included.payments_paymentMethod &&
                included.payments_paymentMethod[included.payments[data.payments[0]].paymentMethod]
                ? included.payments_paymentMethod[included.payments[data.payments[0]].paymentMethod]
                : undefined,
              included.payments[data.payments[0]].paymentInstrument && included.payments_paymentInstrument
                ? included.payments_paymentInstrument[included.payments[data.payments[0]].paymentInstrument]
                : undefined
            )
          : undefined,
      promotionCodes: data.promotionCodes,
      totals,
      infos: infos && infos.filter(info => info.code !== 'include.not_resolved.error'),
    };
  }
}
