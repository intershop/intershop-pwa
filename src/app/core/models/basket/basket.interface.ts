import { AddressData } from '../address/address.interface';
import { BasketRebateData } from '../basket-rebate/basket-rebate.interface';
import { BasketTotalData } from '../basket-total/basket-total.interface';
import { LineItemData } from '../line-item/line-item.interface';
import { PaymentInstrument } from '../payment-instrument/payment-instrument.model';
import { PaymentMethodBaseData } from '../payment-method/payment-method.interface';
import { PriceItem } from '../price-item/price-item.interface';
import { PriceData } from '../price/price.interface';
import { ShippingMethodData } from '../shipping-method/shipping-method.interface';

// ToDo: Find a general way to handle base data
// tslint:disable-next-line:project-structure
export interface BasketBaseData {
  id: string;
  calculated: boolean;
  invoiceToAddress?: string;
  commonShipToAddress?: string;
  commonShippingMethod?: string;
  discounts?: {
    dynamicMessages?: string[];
    shippingBasedDiscounts?: string[];
    valueBasedDiscounts?: string[];
  };
  buckets?: string[];
  lineItems?: string[];
  totals: BasketTotalData;
  totalProductQuantity?: number;
  surcharges?: {
    itemSurcharges?: {
      amount: PriceItem;
      description: string;
      name: string;
    }[];
  };
}

export interface BasketData {
  data: BasketBaseData;
  included?: {
    invoiceToAddress?: { [urn: string]: AddressData };
    lineItems?: { [id: string]: LineItemData };
    discounts?: { [id: string]: BasketRebateData };
    lineItems_discounts?: { [id: string]: BasketRebateData };
    commonShipToAddress?: { [urn: string]: AddressData };
    commonShippingMethod?: { [id: string]: ShippingMethodData };
    payments?: {
      [id: string]: {
        id: string;
        paymentInstrument: string;
        paymentMethod: string;
        paymentCost?: PriceItem;
        totalAmount: { gross: PriceData };
        redirect: {
          redirectUrl: string;
        };
        redirectRequired: boolean;
      };
    };
    payments_paymentMethod?: { [id: string]: PaymentMethodBaseData };
    payments_paymentInstrument?: { [id: string]: PaymentInstrument };
  };
}
