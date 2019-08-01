import { AddressMapper } from '../address/address.mapper';
import { BasketRebateData } from '../basket-rebate/basket-rebate.interface';
import { BasketRebateMapper } from '../basket-rebate/basket-rebate.mapper';
import { BasketTotal } from '../basket-total/basket-total.model';
import { BasketBaseData, BasketData } from '../basket/basket.interface';
import { LineItemMapper } from '../line-item/line-item.mapper';
import { PaymentMapper } from '../payment/payment.mapper';
import { PriceMapper } from '../price/price.mapper';
import { ShippingMethodMapper } from '../shipping-method/shipping-method.mapper';

import { Basket } from './basket.model';

export class BasketMapper {
  static fromData(payload: BasketData): Basket {
    const data = payload.data;
    const included = payload.included;

    const totals = data.calculated
      ? BasketMapper.getTotals(data, included ? included.discounts : undefined)
      : undefined;
    if (totals) {
      totals.isEstimated = !data.invoiceToAddress || !data.commonShipToAddress || !data.commonShippingMethod;
    }

    return {
      id: data.id,
      purchaseCurrency: data.purchaseCurrency, // ToDo: adapt name if fields exists in REST
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
              LineItemMapper.fromData(included.lineItems[lineItemId], included.lineItems_discounts)
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

  /**
   * Helper method to determine a basket(order) total on the base of row data.
   * @returns         The basket total.
   */
  static getTotals(data: BasketBaseData, discounts?: { [id: string]: BasketRebateData }): BasketTotal {
    const totalsData = data.totals;

    return totalsData
      ? {
          itemTotal: PriceMapper.fromPriceItem(totalsData.itemTotal),
          total: PriceMapper.fromPriceItem(totalsData.grandTotal),
          shippingRebatesTotal: PriceMapper.fromPriceItem(totalsData.basketShippingDiscountsTotal),
          valueRebatesTotal: PriceMapper.fromPriceItem(totalsData.basketValueDiscountsTotal),
          dutiesAndSurchargesTotal: PriceMapper.fromPriceItem(totalsData.surchargeTotal),
          itemRebatesTotal: PriceMapper.fromPriceItem(totalsData.itemValueDiscountsTotal),
          itemShippingRebatesTotal: PriceMapper.fromPriceItem(totalsData.itemShippingDiscountsTotal),
          paymentCostsTotal: PriceMapper.fromPriceItem(totalsData.paymentCostTotal),
          shippingTotal: PriceMapper.fromPriceItem(totalsData.shippingTotal),
          taxTotal: { ...totalsData.grandTotal.tax, type: 'Money' },
          valueRebates:
            data.discounts && data.discounts.valueBasedDiscounts && discounts
              ? data.discounts.valueBasedDiscounts.map(discountId => BasketRebateMapper.fromData(discounts[discountId]))
              : undefined,
          shippingRebates:
            data.discounts && data.discounts.shippingBasedDiscounts && discounts
              ? data.discounts.shippingBasedDiscounts.map(discountId =>
                  BasketRebateMapper.fromData(discounts[discountId])
                )
              : undefined,
          itemSurchargeTotalsByType: data.surcharges
            ? data.surcharges.itemSurcharges.map(surcharge => ({
                amount: PriceMapper.fromPriceItem(surcharge.amount),
                displayName: surcharge.name,
                description: surcharge.description,
              }))
            : undefined,
          isEstimated: false,
        }
      : undefined;
  }
}
