import { BasketItemData } from '../basket-item/basket-item.interface';
import { BasketItemMapper } from '../basket-item/basket-item.mapper';
import { OrderData } from './order.interface';
import { Order } from './order.model';

export class OrderMapper {
  static fromData(data: OrderData) {
    const order: Order = {
      id: data.id,
      documentNo: data.documentNo,
      creationDate: new Date(data.creationDate),
      status: data.status,
      purchaseCurrency: data.purchaseCurrency,
      dynamicMessages: data.dynamicMessages,
      invoiceToAddress: data.invoiceToAddress,
      totals: data.totals,
      valueRebates: data.valueRebates,
      itemSurchargeTotalsByType: data.itemSurchargeTotalsByType,
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
