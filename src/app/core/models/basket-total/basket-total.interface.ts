import { PriceItem } from '../price-item/price-item.interface';
import { Price } from '../price/price.model';

export interface BasketTotalData {
  grandTotal: PriceItem;
  itemTotal: PriceItem;
  discountedItemTotal: PriceItem;
  shippingTotal?: PriceItem;
  basketShippingDiscountsTotal?: PriceItem;
  basketValueDiscountsTotal?: PriceItem;
  itemShippingDiscountsTotal?: PriceItem;
  itemValueDiscountsTotal?: PriceItem;
  surchargeTotal?: PriceItem;
  taxTotalsByTaxRate?: {
    calculatedTax: Price;
  }[];

  /* is currently not available */
  taxTotal?: PriceItem;

  /* is currently not available */
  paymentCostsTotal?: PriceItem;
}
