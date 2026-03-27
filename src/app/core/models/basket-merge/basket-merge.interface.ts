import { AddressData } from 'ish-core/models/address/address.interface';
import { BasketRebateData } from 'ish-core/models/basket-rebate/basket-rebate.interface';
import { BasketWarrantyData } from 'ish-core/models/basket-warranty/basket-warranty.interface';
import { BasketBaseData } from 'ish-core/models/basket/basket.interface';
import { LineItemData } from 'ish-core/models/line-item/line-item.interface';
import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';
import { PaymentMethodBaseData } from 'ish-core/models/payment-method/payment-method.interface';
import { PaymentData } from 'ish-core/models/payment/payment.interface';
import { ShippingMethodData } from 'ish-core/models/shipping-method/shipping-method.interface';

interface BasketMergeBaseData {
  sourceBasket: string;
  targetBasket: string;
}

export interface BasketMergeData {
  data: BasketMergeBaseData;
  included?: {
    targetBasket: Record<string, BasketBaseData>;
    targetBasket_invoiceToAddress?: Record<string, AddressData>;
    targetBasket_lineItems?: Record<string, LineItemData>;
    targetBasket_lineItems_warranty?: Record<string, BasketWarrantyData>;
    targetBasket_lineItems_discounts?: Record<string, BasketRebateData>;
    targetBasket_discounts?: Record<string, BasketRebateData>;
    targetBasket_commonShipToAddress?: Record<string, AddressData>;
    targetBasket_commonShippingMethod?: Record<string, ShippingMethodData>;
    targetBasket_payments?: Record<string, PaymentData>;
    targetBasket_payments_paymentMethod?: Record<string, PaymentMethodBaseData>;
    targetBasket_payments_paymentInstrument?: Record<string, PaymentInstrument>;
  };
}
