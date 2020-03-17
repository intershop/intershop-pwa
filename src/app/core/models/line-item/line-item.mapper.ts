import { Injectable } from '@angular/core';

import { BasketRebateData } from 'ish-core/models/basket-rebate/basket-rebate.interface';
import { BasketRebateMapper } from 'ish-core/models/basket-rebate/basket-rebate.mapper';
import { OrderItemData } from 'ish-core/models/order-item/order-item.interface';
import { PriceMapper } from 'ish-core/models/price/price.mapper';

import { LineItemData } from './line-item.interface';
import { LineItem } from './line-item.model';

@Injectable({ providedIn: 'root' })
export class LineItemMapper {
  constructor(private priceMapper: PriceMapper, private basketRebateMapper: BasketRebateMapper) {}

  fromOrderItemData(data: OrderItemData, rebateData?: { [id: string]: BasketRebateData }): LineItem {
    if (data) {
      const orderItem = this.fromData(data, rebateData);

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

  fromData(data: LineItemData, rebateData?: { [id: string]: BasketRebateData }): LineItem {
    if (data) {
      return {
        id: data.id,
        position: data.position,
        quantity: data.quantity,
        price: data.pricing ? this.priceMapper.fromPriceItem(data.pricing.price) : undefined,
        singleBasePrice: data.pricing ? this.priceMapper.fromPriceItem(data.pricing.singleBasePrice) : undefined,
        itemSurcharges: data.surcharges
          ? data.surcharges.map(surcharge => ({
              amount: this.priceMapper.fromPriceItem(surcharge.amount),
              description: surcharge.description,
              displayName: surcharge.name,
            }))
          : undefined,
        valueRebates:
          data.discounts && rebateData
            ? data.discounts.map(discountId => this.basketRebateMapper.fromData(rebateData[discountId]))
            : undefined,
        isHiddenGift: data.hiddenGift,
        isFreeGift: data.freeGift,
        totals:
          data.calculated || data.calculated === undefined
            ? {
                salesTaxTotal: data.pricing.salesTaxTotal,
                shippingTaxTotal: data.pricing.shippingTaxTotal,
                shippingTotal: this.priceMapper.fromPriceItem(data.pricing.shippingTotal),
                total: this.priceMapper.fromPriceItem(data.pricing.price),
                undiscountedTotal: this.priceMapper.fromPriceItem(data.pricing.undiscountedPrice),
                valueRebatesTotal: this.priceMapper.fromPriceItem(data.pricing.valueRebatesTotal),
              }
            : undefined,

        productSKU: data.product,
        isQuantityFixed: data.quantityFixed,
      };
    } else {
      throw new Error(`'LineItemData' is required for the mapping`);
    }
  }
}
