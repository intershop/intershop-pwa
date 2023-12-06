import { AddressMapper } from 'ish-core/models/address/address.mapper';
import { BasketRebateData } from 'ish-core/models/basket-rebate/basket-rebate.interface';
import { BasketRebateMapper } from 'ish-core/models/basket-rebate/basket-rebate.mapper';
import { BasketTotal } from 'ish-core/models/basket-total/basket-total.model';
import { BasketBaseData, BasketData } from 'ish-core/models/basket/basket.interface';
import { CustomFieldMapper } from 'ish-core/models/custom-field/custom-field.mapper';
import { LineItemMapper } from 'ish-core/models/line-item/line-item.mapper';
import { PaymentMapper } from 'ish-core/models/payment/payment.mapper';
import { PriceItemMapper } from 'ish-core/models/price-item/price-item.mapper';
import { ShippingMethodMapper } from 'ish-core/models/shipping-method/shipping-method.mapper';

import { Basket } from './basket.model';

export class BasketMapper {
  // eslint-disable-next-line complexity
  static fromData(payload: BasketData): Basket {
    const { data, included, infos } = payload;

    const totals = data.calculated
      ? BasketMapper.getTotals(data, included ? included.discounts : undefined)
      : undefined;
    if (totals) {
      totals.isEstimated = !data.invoiceToAddress || !data.commonShipToAddress || !data.commonShippingMethod;
    }

    return {
      id: data.id,
      bucketId: (data.buckets?.length === 1 && data.buckets[0]) || undefined,
      purchaseCurrency: data.purchaseCurrency,
      dynamicMessages: data.discounts ? data.discounts.dynamicMessages : undefined,
      invoiceToAddress:
        included?.invoiceToAddress && data.invoiceToAddress
          ? AddressMapper.fromData(included.invoiceToAddress[data.invoiceToAddress])
          : undefined,
      commonShipToAddress:
        included?.commonShipToAddress && data.commonShipToAddress
          ? AddressMapper.fromData(included.commonShipToAddress[data.commonShipToAddress])
          : undefined,
      commonShippingMethod:
        included?.commonShippingMethod && data.commonShippingMethod
          ? ShippingMethodMapper.fromData(included.commonShippingMethod[data.commonShippingMethod])
          : undefined,
      costCenter: data.costCenter,
      customerNo: data.customer,
      email: data.user,
      lineItems:
        included?.lineItems && data.lineItems?.length
          ? data.lineItems.map(lineItemId =>
              LineItemMapper.fromData(
                included.lineItems[lineItemId],
                included.lineItems_discounts,
                included.lineItems_warranty
              )
            )
          : [],
      totalProductQuantity: data.totalProductQuantity,
      payment:
        included?.payments && data.payments?.length && included.payments[data.payments[0]]
          ? PaymentMapper.fromIncludeData(
              included.payments[data.payments[0]],
              included.payments_paymentMethod?.[included.payments[data.payments[0]].paymentMethod]
                ? included.payments_paymentMethod[included.payments[data.payments[0]].paymentMethod]
                : undefined,
              included.payments[data.payments[0]].paymentInstrument && included.payments_paymentInstrument
                ? included.payments_paymentInstrument[included.payments[data.payments[0]].paymentInstrument]
                : undefined
            )
          : undefined,
      promotionCodes: data.promotionCodes,
      totals,
      infos: infos?.filter(info => info.code !== 'include.not_resolved.error'),
      approval: data.approval,
      attributes: data.attributes,
      taxationId: data.attributes?.find(attr => attr.name === 'taxationID')?.value as string,
      user: data.buyer,
      externalOrderReference: data.externalOrderReference,
      messageToMerchant: data.messageToMerchant,
      customFields: CustomFieldMapper.fromData(data.customFields),
    };
  }

  /**
   * Helper method to determine a basket(order) total on the base of row data.
   *
   * @returns         The basket total.
   */
  static getTotals(data: BasketBaseData, discounts?: { [id: string]: BasketRebateData }): BasketTotal {
    const totalsData = data.totals;

    return totalsData
      ? {
          itemTotal: PriceItemMapper.fromPriceItem(totalsData.itemTotal),
          undiscountedItemTotal: PriceItemMapper.fromPriceItem(totalsData.undiscountedItemTotal),
          shippingTotal: PriceItemMapper.fromPriceItem(totalsData.shippingTotal),
          undiscountedShippingTotal: PriceItemMapper.fromPriceItem(totalsData.undiscountedShippingTotal),
          paymentCostsTotal: PriceItemMapper.fromPriceItem(totalsData.paymentCostsTotal),
          dutiesAndSurchargesTotal: PriceItemMapper.fromPriceItem(totalsData.surchargeTotal),
          taxTotal: PriceItemMapper.fromSpecificPriceItem(totalsData.grandTotal, 'tax'),
          total: PriceItemMapper.fromPriceItem(totalsData.grandTotal),

          itemRebatesTotal: PriceItemMapper.fromPriceItem(totalsData.itemValueDiscountsTotal),
          valueRebatesTotal: PriceItemMapper.fromPriceItem(totalsData.basketValueDiscountsTotal),
          valueRebates:
            data.discounts?.valueBasedDiscounts && discounts
              ? data.discounts.valueBasedDiscounts.map(discountId => BasketRebateMapper.fromData(discounts[discountId]))
              : undefined,

          itemShippingRebatesTotal: PriceItemMapper.fromPriceItem(totalsData.itemShippingDiscountsTotal),
          shippingRebatesTotal: PriceItemMapper.fromPriceItem(totalsData.basketShippingDiscountsTotal),
          shippingRebates:
            data.discounts?.shippingBasedDiscounts && discounts
              ? data.discounts.shippingBasedDiscounts.map(discountId =>
                  BasketRebateMapper.fromData(discounts[discountId])
                )
              : undefined,

          itemSurchargeTotalsByType: data.surcharges?.itemSurcharges
            ? data.surcharges.itemSurcharges.map(surcharge => ({
                amount: PriceItemMapper.fromPriceItem(surcharge.amount),
                displayName: surcharge.name,
                description: surcharge.description,
              }))
            : undefined,
          bucketSurchargeTotalsByType: data.surcharges?.bucketSurcharges
            ? data.surcharges.bucketSurcharges.map(surcharge => ({
                amount: PriceItemMapper.fromPriceItem(surcharge.amount),
                displayName: surcharge.name,
                description: surcharge.description,
              }))
            : undefined,
          isEstimated: false,
        }
      : undefined;
  }
}
