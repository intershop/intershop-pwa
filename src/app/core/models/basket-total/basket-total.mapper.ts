import { Injectable } from '@angular/core';

import { BasketRebateData } from 'ish-core/models/basket-rebate/basket-rebate.interface';
import { BasketRebateMapper } from 'ish-core/models/basket-rebate/basket-rebate.mapper';
import { BasketTotal } from 'ish-core/models/basket-total/basket-total.model';
import { BasketBaseData } from 'ish-core/models/basket/basket.interface';
import { PriceMapper } from 'ish-core/models/price/price.mapper';

@Injectable({ providedIn: 'root' })
export class BasketTotalMapper {
  constructor(private priceMapper: PriceMapper, private basketRebateMapper: BasketRebateMapper) {}

  /**
   * Helper method to determine a basket(order) total on the base of row data.
   * @returns         The basket total.
   */
  getTotals(data: BasketBaseData, discounts?: { [id: string]: BasketRebateData }): BasketTotal {
    const totalsData = data.totals;

    return totalsData
      ? {
          itemTotal: this.priceMapper.fromPriceItem(totalsData.itemTotal),
          undiscountedItemTotal: this.priceMapper.fromPriceItem(totalsData.undiscountedItemTotal),
          shippingTotal: this.priceMapper.fromPriceItem(totalsData.shippingTotal),
          undiscountedShippingTotal: this.priceMapper.fromPriceItem(totalsData.undiscountedShippingTotal),
          paymentCostsTotal: this.priceMapper.fromPriceItem(totalsData.paymentCostsTotal),
          dutiesAndSurchargesTotal: this.priceMapper.fromPriceItem(totalsData.surchargeTotal),
          taxTotal: { ...totalsData.grandTotal.tax, type: 'Money' },
          total: this.priceMapper.fromPriceItem(totalsData.grandTotal),

          itemRebatesTotal: this.priceMapper.fromPriceItem(totalsData.itemValueDiscountsTotal),
          valueRebatesTotal: this.priceMapper.fromPriceItem(totalsData.basketValueDiscountsTotal),
          valueRebates:
            data.discounts && data.discounts.valueBasedDiscounts && discounts
              ? data.discounts.valueBasedDiscounts.map(discountId =>
                  this.basketRebateMapper.fromData(discounts[discountId])
                )
              : undefined,

          itemShippingRebatesTotal: this.priceMapper.fromPriceItem(totalsData.itemShippingDiscountsTotal),
          shippingRebatesTotal: this.priceMapper.fromPriceItem(totalsData.basketShippingDiscountsTotal),
          shippingRebates:
            data.discounts && data.discounts.shippingBasedDiscounts && discounts
              ? data.discounts.shippingBasedDiscounts.map(discountId =>
                  this.basketRebateMapper.fromData(discounts[discountId])
                )
              : undefined,

          itemSurchargeTotalsByType:
            data.surcharges && data.surcharges.itemSurcharges
              ? data.surcharges.itemSurcharges.map(surcharge => ({
                  amount: this.priceMapper.fromPriceItem(surcharge.amount),
                  displayName: surcharge.name,
                  description: surcharge.description,
                }))
              : undefined,
          bucketSurchargeTotalsByType:
            data.surcharges && data.surcharges.bucketSurcharges
              ? data.surcharges.bucketSurcharges.map(surcharge => ({
                  amount: this.priceMapper.fromPriceItem(surcharge.amount),
                  displayName: surcharge.name,
                  description: surcharge.description,
                }))
              : undefined,
          isEstimated: false,
        }
      : undefined;
  }
}
