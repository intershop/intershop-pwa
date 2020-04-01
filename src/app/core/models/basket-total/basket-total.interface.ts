import { PriceItemData } from 'ish-core/models/price-item/price-item.interface';

export interface BasketTotalData {
  itemTotal: PriceItemData;
  undiscountedItemTotal?: PriceItemData;
  shippingTotal?: PriceItemData;
  undiscountedShippingTotal: PriceItemData;
  paymentCostsTotal?: PriceItemData;
  surchargeTotal?: PriceItemData;
  grandTotal: PriceItemData;

  itemValueDiscountsTotal?: PriceItemData;
  basketValueDiscountsTotal?: PriceItemData;

  itemShippingDiscountsTotal?: PriceItemData;
  basketShippingDiscountsTotal?: PriceItemData;

  shippingDiscountsTotal?: PriceItemData;
  valueDiscountsTotal: PriceItemData;
  discountTotal?: PriceItemData;
}
