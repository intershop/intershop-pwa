import { BasketItemData } from '../basket-item/basket-item.interface';
import { BasketItemMapper } from '../basket-item/basket-item.mapper';
import { BasketTotal } from '../basket-total/basket-total.model';
import { OrderData } from './order.interface';
import { Order } from './order.model';

export class OrderMapper {
  static fromData(data: OrderData) {
    const totals: BasketTotal = {
      shippingRebatesTotal: data.totals.orderShippingRebatesTotal,
      total: data.totals.orderTotal,
      valueRebatesTotal: data.totals.orderValueRebatesTotal,
      dutiesAndSurchargesTotal: data.totals.dutiesAndSurchargesTotal,
      itemRebatesTotal: data.totals.itemRebatesTotal,
      itemShippingRebatesTotal: data.totals.itemShippingRebatesTotal,
      itemTotal: data.totals.itemTotal,
      paymentCostsTotal: data.totals.paymentCostsTotal,
      shippingTotal: data.totals.shippingTotal,
      taxTotal: data.totals.taxTotal,
      valueRebates: data.valueRebates,
      itemSurchargeTotalsByType: data.itemSurchargeTotalsByType,
      isEstimated: false,
    };

    const order: Order = {
      id: data.id,
      documentNo: data.documentNo,
      creationDate: new Date(data.creationDate),
      status: data.status,
      purchaseCurrency: data.purchaseCurrency,
      dynamicMessages: data.dynamicMessages,
      invoiceToAddress: data.invoiceToAddress,
      totals: totals,
    };

    if (data.shippingBuckets && data.shippingBuckets.length > 0) {
      const shippingBucket = data.shippingBuckets[0];

      order.commonShippingMethod = shippingBucket.shippingMethod;
      order.commonShipToAddress = shippingBucket.shipToAddress;
      order.lineItems = shippingBucket.lineItems.map(pli => BasketItemMapper.fromData(pli as BasketItemData));
    }

    if (data.payments && data.payments.length > 0) {
      order.paymentMethod = data.payments[0];
    }

    return order;
  }
}
