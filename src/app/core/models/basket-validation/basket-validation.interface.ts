import { AddressData } from 'ish-core/models/address/address.interface';
import { BasketRebateData } from 'ish-core/models/basket-rebate/basket-rebate.interface';
import { BasketBaseData } from 'ish-core/models/basket/basket.interface';
import { LineItemData } from 'ish-core/models/line-item/line-item.interface';
import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';
import { PaymentMethodBaseData } from 'ish-core/models/payment-method/payment-method.interface';
import { PaymentData } from 'ish-core/models/payment/payment.interface';
import { ShippingMethodData } from 'ish-core/models/shipping-method/shipping-method.interface';

import { BasketValidationResultType, BasketValidationScopeType } from './basket-validation.model';

export interface BasketValidationData {
  data: {
    basket: string;
    results: BasketValidationResultType;
    scopes?: BasketValidationScopeType[];
  };
  included?: {
    basket: Record<string, BasketBaseData>;
    basket_invoiceToAddress?: Record<string, AddressData>;
    basket_lineItems?: Record<string, LineItemData>;
    basket_discounts?: Record<string, BasketRebateData>;
    basket_lineItems_discounts?: Record<string, BasketRebateData>;
    basket_commonShipToAddress?: Record<string, AddressData>;
    basket_commonShippingMethod?: Record<string, ShippingMethodData>;
    basket_payments?: Record<string, PaymentData>;
    basket_payments_paymentMethod?: Record<string, PaymentMethodBaseData>;
    basket_payments_paymentInstrument?: Record<string, PaymentInstrument>;
  };
}
