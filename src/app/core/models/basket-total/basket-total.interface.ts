import { PriceItem } from '../price-item/price-item.interface';
import { Price } from '../price/price.model';

export interface BasketTotalData {
  itemTotal: PriceItem;
  undiscountedItemTotal?: PriceItem;
  shippingTotal?: PriceItem;
  undiscountedShippingTotal: PriceItem;
  paymentCostsTotal?: PriceItem;
  surchargeTotal?: PriceItem;
  grandTotal: PriceItem;

  itemValueDiscountsTotal?: PriceItem;
  basketValueDiscountsTotal?: PriceItem;

  itemShippingDiscountsTotal?: PriceItem;
  basketShippingDiscountsTotal?: PriceItem;

  shippingDiscountsTotal?: PriceItem;
  valueDiscountsTotal: PriceItem;
  discountTotal?: PriceItem;

  taxTotalsByTaxRate?: {
    calculatedTax: Price;
  }[];
}
