import { AddressData } from 'ish-core/models/address/address.interface';
import { BasketInfo } from 'ish-core/models/basket-info/basket-info.model';
import { BasketRebateData } from 'ish-core/models/basket-rebate/basket-rebate.interface';
import { BasketTotalData } from 'ish-core/models/basket-total/basket-total.interface';
import { LineItemData } from 'ish-core/models/line-item/line-item.interface';
import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';
import { PaymentMethodBaseData } from 'ish-core/models/payment-method/payment-method.interface';
import { PaymentData } from 'ish-core/models/payment/payment.interface';
import { PriceItem } from 'ish-core/models/price-item/price-item.interface';
import { ShippingMethodData } from 'ish-core/models/shipping-method/shipping-method.interface';

export interface BasketBaseData {
  id: string;
  purchaseCurrency?: string;
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
  payments?: string[];
  promotionCodes?: string[];
  totals: BasketTotalData;
  totalProductQuantity?: number;
  surcharges?: {
    itemSurcharges?: {
      amount: PriceItem;
      description: string;
      name: string;
    }[];
    bucketSurcharges?: {
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
    payments?: { [id: string]: PaymentData };
    payments_paymentMethod?: { [id: string]: PaymentMethodBaseData };
    payments_paymentInstrument?: { [id: string]: PaymentInstrument };
  };
  infos?: BasketInfo[];
}
