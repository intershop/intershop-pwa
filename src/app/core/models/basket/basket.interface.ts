import { AddressData } from 'ish-core/models/address/address.interface';
import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { BasketApproval } from 'ish-core/models/basket-approval/basket-approval.model';
import { BasketInfo } from 'ish-core/models/basket-info/basket-info.model';
import { BasketRebateData } from 'ish-core/models/basket-rebate/basket-rebate.interface';
import { BasketTotalData } from 'ish-core/models/basket-total/basket-total.interface';
import { BasketWarrantyData } from 'ish-core/models/basket-warranty/basket-warranty.interface';
import { CustomFieldData } from 'ish-core/models/custom-field/custom-field.interface';
import { LineItemData } from 'ish-core/models/line-item/line-item.interface';
import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';
import { PaymentMethodBaseData } from 'ish-core/models/payment-method/payment-method.interface';
import { PaymentData } from 'ish-core/models/payment/payment.interface';
import { PriceItemData } from 'ish-core/models/price-item/price-item.interface';
import { Recurrence } from 'ish-core/models/recurrence/recurrence.model';
import { ShippingMethodData } from 'ish-core/models/shipping-method/shipping-method.interface';

export interface BasketBaseData {
  id: string;
  calculated: boolean;
  purchaseCurrency?: string;
  invoiceToAddress?: string;
  commonShipToAddress?: string;
  commonShippingMethod?: string;
  costCenter?: string;
  customer?: string;
  user?: string;
  discounts?: {
    dynamicMessages?: string[];
    shippingBasedDiscounts?: string[];
    valueBasedDiscounts?: string[];
  };
  buckets?: string[];
  externalOrderReference?: string;
  lineItems?: string[];
  messageToMerchant?: string;
  payments?: string[];
  promotionCodes?: string[];
  totals: BasketTotalData;
  totalProductQuantity?: number;
  surcharges?: {
    itemSurcharges?: {
      amount: PriceItemData;
      description: string;
      name: string;
    }[];
    bucketSurcharges?: {
      amount: PriceItemData;
      description: string;
      name: string;
    }[];
  };
  approval?: BasketApproval;
  attributes?: Attribute[];
  buyer?: {
    companyName?: string;
    companyName2?: string;
    firstName: string;
    lastName: string;
  };
  recurrence?: Recurrence;
  customFields?: CustomFieldData[];
}

export interface BasketIncludedData {
  invoiceToAddress?: Record<string, AddressData>;
  lineItems?: Record<string, LineItemData>;
  discounts?: Record<string, BasketRebateData>;
  lineItems_discounts?: Record<string, BasketRebateData>;
  lineItems_warranty?: Record<string, BasketWarrantyData>;
  commonShipToAddress?: Record<string, AddressData>;
  commonShippingMethod?: Record<string, ShippingMethodData>;
  payments?: Record<string, PaymentData>;
  payments_paymentMethod?: Record<string, PaymentMethodBaseData>;
  payments_paymentInstrument?: Record<string, PaymentInstrument>;
}

export interface BasketData {
  data: BasketBaseData;
  included?: BasketIncludedData;
  infos?: BasketInfo[];
}
