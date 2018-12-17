import { AddressMapper } from '../address/address.mapper';
import { BasketRebateMapper } from '../basket-rebate/basket-rebate.mapper';
import { BasketTotal } from '../basket-total/basket-total.model';
import { BasketData } from '../basket/basket.interface';
import { LineItemMapper } from '../line-item/line-item.mapper';
import { PriceMapper } from '../price/price.mapper';
import { ShippingMethodMapper } from '../shipping-method/shipping-method.mapper';

import { Basket } from './basket.model';

export class BasketMapper {
  static fromData(payload: BasketData): Basket {
    const data = payload.data;
    const included = payload.included;

    const totals: BasketTotal =
      data.calculationState === 'CALCULATED'
        ? {
            itemTotal: PriceMapper.fromPriceItem(data.totals.discountedItemTotal),
            total: PriceMapper.fromPriceItem(data.totals.grandTotal),
            shippingRebatesTotal: PriceMapper.fromPriceItem(data.totals.basketShippingDiscountsTotal),
            valueRebatesTotal: PriceMapper.fromPriceItem(data.totals.basketValueDiscountsTotal),
            dutiesAndSurchargesTotal: PriceMapper.fromPriceItem(data.totals.surchargeTotal),
            itemRebatesTotal: PriceMapper.fromPriceItem(data.totals.itemValueDiscountsTotal),
            itemShippingRebatesTotal: PriceMapper.fromPriceItem(data.totals.itemShippingDiscountsTotal),
            paymentCostsTotal: undefined, // ToDo
            shippingTotal: PriceMapper.fromPriceItem(data.totals.shippingTotal),
            taxTotal: { ...data.totals.grandTotal.tax, type: 'Money' },
            valueRebates:
              data.discounts && data.discounts.valueBasedDiscounts && included.discounts
                ? data.discounts.valueBasedDiscounts.map(discountId =>
                    BasketRebateMapper.fromData(included.discounts[discountId])
                  )
                : undefined,
            itemSurchargeTotalsByType: data.surcharges
              ? data.surcharges.itemSurcharges.map(surcharge => ({
                  amount: PriceMapper.fromPriceItem(surcharge.amount),
                  displayName: surcharge.name,
                  description: surcharge.description,
                }))
              : undefined,
            isEstimated: !data.invoiceToAddress || !data.commonShipToAddress || !data.commonShippingMethod,
          }
        : undefined;

    return {
      id: data.id,
      purchaseCurrency: undefined, // ToDo
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
          ? data.lineItems.map(lineItemId => LineItemMapper.fromData(included.lineItems[lineItemId]))
          : [],
      totals,
    };
  }
}
