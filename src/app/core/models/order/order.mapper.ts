import { AddressMapper } from '../address/address.mapper';
import { BasketMapper } from '../basket/basket.mapper';
import { LineItemMapper } from '../line-item/line-item.mapper';
import { PaymentMapper } from '../payment/payment.mapper';
import { ShippingMethodMapper } from '../shipping-method/shipping-method.mapper';

import { OrderData } from './order.interface';
import { Order } from './order.model';

export class OrderMapper {
  static fromData(payload: OrderData): Order {
    if (!Array.isArray(payload.data)) {
      const { data, included } = payload;
      const totals = BasketMapper.getTotals(data, included ? included.discounts : undefined);

      return {
        id: data.id,
        documentNo: data.documentNumber,
        creationDate: new Date(data.creationDate),
        orderCreation: data.orderCreation,
        statusCode: data.statusCode,
        status: data.status,

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
            ? ShippingMethodMapper.fromData(included.commonShippingMethod[data.commonShippingMethod])
            : undefined,
        lineItems:
          included && included.lineItems && data.lineItems && data.lineItems.length
            ? data.lineItems.map(lineItemId =>
                LineItemMapper.fromOrderItemData(included.lineItems[lineItemId], included.lineItems_discounts)
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
        totals,
      };
    }
  }

  static fromListData(payload: OrderData): Order[] {
    if (Array.isArray(payload.data)) {
      return payload.data.map(data => OrderMapper.fromData({ ...payload, data }));
    }
  }
}
