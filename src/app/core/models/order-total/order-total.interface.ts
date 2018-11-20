import { Price } from '../price/price.model';

export interface OrderTotalData {
  orderShippingRebatesTotal?: Price;
  orderTotal: Price;
  orderValueRebatesTotal?: Price;
  dutiesAndSurchargesTotal?: Price;
  itemRebatesTotal?: Price;
  itemShippingRebatesTotal?: Price;
  itemTotal: Price;
  paymentCostsTotal?: Price;
  shippingTotal?: Price;
  taxTotal?: Price;
}
