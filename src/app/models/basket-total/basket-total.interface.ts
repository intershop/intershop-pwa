import { Price } from '../price/price.model';

export interface BasketTotalData {
  basketShippingRebatesTotal?: Price;
  basketTotal: Price;
  basketValueRebatesTotal?: Price;
  dutiesAndSurchargesTotal?: Price;
  itemRebatesTotal?: Price;
  itemShippingRebatesTotal?: Price;
  itemTotal: Price;
  paymentCostsTotal?: Price;
  shippingTotal?: Price;
  taxTotal?: Price;
}
