import { AddressMapper } from 'ish-core/models/address/address.mapper';
import { AttributeHelper } from 'ish-core/models/attribute/attribute.helper';
import { BasketMapper } from 'ish-core/models/basket/basket.mapper';
import { LineItemMapper } from 'ish-core/models/line-item/line-item.mapper';
import { PaymentMapper } from 'ish-core/models/payment/payment.mapper';
import { ShippingMethodMapper } from 'ish-core/models/shipping-method/shipping-method.mapper';

import { OrderData } from './order.interface';
import { Order } from './order.model';

export class OrderMapper {
  static fromData(payload: OrderData): Order {
    if (!Array.isArray(payload.data)) {
      const { data, included, infos } = payload;
      const totals = BasketMapper.getTotals(data, included ? included.discounts : undefined);

      return {
        id: data.id,
        documentNo: data.documentNumber,
        creationDate: data.creationDate,
        orderCreation: data.orderCreation,
        statusCode: data.statusCode,
        status: data.status,
        requisitionNo: data.requisitionDocumentNo,
        approval:
          data.attributes &&
          AttributeHelper.getAttributeValueByAttributeName(
            data.attributes,
            'BusinessObjectAttributes#OrderApproval_ApprovalDate'
          )
            ? {
                date: AttributeHelper.getAttributeValueByAttributeName(
                  data.attributes,
                  'BusinessObjectAttributes#OrderApproval_ApprovalDate'
                ),
                approverFirstName: AttributeHelper.getAttributeValueByAttributeName(
                  data.attributes,
                  'BusinessObjectAttributes#OrderApproval_ApproverFirstName'
                ),
                approverLastName: AttributeHelper.getAttributeValueByAttributeName(
                  data.attributes,
                  'BusinessObjectAttributes#OrderApproval_ApproverLastName'
                ),
              }
            : undefined,
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
        customerNo: data.customer,
        email: data.user,
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
        infos,
        attributes: data.attributes,
      };
    }
  }

  static fromListData(payload: OrderData): Order[] {
    if (Array.isArray(payload.data)) {
      return payload.data.map(data => OrderMapper.fromData({ ...payload, data }));
    }
  }
}
