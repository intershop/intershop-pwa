import { BasketRebateData } from 'ish-core/models/basket-rebate/basket-rebate.interface';
import { BasketRebateMapper } from 'ish-core/models/basket-rebate/basket-rebate.mapper';
import { BasketWarrantyData } from 'ish-core/models/basket-warranty/basket-warranty.interface';
import { BasketWarrantyMapper } from 'ish-core/models/basket-warranty/basket-warranty.mapper';
import { CustomFieldMapper } from 'ish-core/models/custom-field/custom-field.mapper';
import { OrderItemData } from 'ish-core/models/order-item/order-item.interface';
import { OrderLineItem } from 'ish-core/models/order/order.model';
import { PriceItemMapper } from 'ish-core/models/price-item/price-item.mapper';
import { PriceMapper } from 'ish-core/models/price/price.mapper';

import { LineItemData } from './line-item.interface';
import { LineItem } from './line-item.model';

export class LineItemMapper {
  // eslint-disable-next-line complexity
  static fromData(
    data: LineItemData,
    rebateData?: { [id: string]: BasketRebateData },
    warrantyData?: { [id: string]: BasketWarrantyData }
  ): LineItem {
    if (data) {
      return {
        id: data.id,
        position: data.position,
        quantity: data.quantity,
        price: data.pricing ? PriceItemMapper.fromPriceItem(data.pricing.price) : undefined,
        singleBasePrice: data.pricing ? PriceItemMapper.fromPriceItem(data.pricing.singleBasePrice) : undefined,
        undiscountedSingleBasePrice: data.pricing
          ? PriceItemMapper.fromPriceItem(data.pricing.undiscountedSingleBasePrice)
          : undefined,
        itemSurcharges: data.surcharges
          ? data.surcharges.map(surcharge => ({
              amount: PriceItemMapper.fromPriceItem(surcharge.amount),
              description: surcharge.description,
              displayName: surcharge.name,
            }))
          : undefined,
        valueRebates:
          data.discounts && rebateData
            ? data.discounts.map(discountId => BasketRebateMapper.fromData(rebateData[discountId]))
            : undefined,
        isHiddenGift: data.hiddenGift,
        isFreeGift: data.freeGift,
        totals:
          data.calculated || data.calculated === undefined
            ? {
                salesTaxTotal: PriceMapper.fromData(data.pricing.salesTaxTotal),
                shippingTaxTotal: PriceMapper.fromData(data.pricing.shippingTaxTotal),
                shippingTotal: PriceItemMapper.fromPriceItem(data.pricing.shippingTotal),
                total: PriceItemMapper.fromPriceItem(data.pricing.price),
                undiscountedTotal: PriceItemMapper.fromPriceItem(data.pricing.undiscountedPrice),
                valueRebatesTotal: PriceItemMapper.fromPriceItem(data.pricing.valueRebatesTotal),
              }
            : undefined,

        productSKU: data.product,
        editable: !data.quantityFixed,
        quote: data.quote ? data.quote : undefined,
        desiredDeliveryDate: data.desiredDelivery,
        customFields: CustomFieldMapper.fromData(data.customFields),
        warranty:
          data.warranty && warrantyData ? BasketWarrantyMapper.fromData(warrantyData[data.warranty]) : undefined,
      };
    } else {
      throw new Error(`'LineItemData' is required for the mapping`);
    }
  }

  static fromOrderItemData(
    data: OrderItemData,
    rebateData?: { [id: string]: BasketRebateData },
    warrantyData?: { [id: string]: BasketWarrantyData }
  ): OrderLineItem {
    if (data) {
      const orderItem = LineItemMapper.fromData(data, rebateData, warrantyData);

      return {
        ...orderItem,
        description: data.description,
        name: data.displayName,
        fulfillmentStatus: data.fulfillmentStatus,
      };
    } else {
      throw new Error(`'OrderItemData' is required for the mapping`);
    }
  }
}
