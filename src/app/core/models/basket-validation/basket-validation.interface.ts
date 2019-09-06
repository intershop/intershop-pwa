import { AddressData } from '../address/address.interface';
import { BasketRebateData } from '../basket-rebate/basket-rebate.interface';
import { BasketBaseData } from '../basket/basket.interface';
import { LineItemData } from '../line-item/line-item.interface';
import { PaymentInstrument } from '../payment-instrument/payment-instrument.model';
import { PaymentMethodBaseData } from '../payment-method/payment-method.interface';
import { PaymentData } from '../payment/payment.interface';
import { ShippingMethodData } from '../shipping-method/shipping-method.interface';

import { BasketValidationResultType } from './basket-validation.model';

export interface BasketValidationData {
  data: {
    basket: string;
    results: BasketValidationResultType;
  };
  included?: {
    basket: { [id: string]: BasketBaseData };
    basket_invoiceToAddress?: { [urn: string]: AddressData };
    basket_lineItems?: { [id: string]: LineItemData };
    basket_discounts?: { [id: string]: BasketRebateData };
    basket_lineItems_discounts?: { [id: string]: BasketRebateData };
    basket_commonShipToAddress?: { [urn: string]: AddressData };
    basket_commonShippingMethod?: { [id: string]: ShippingMethodData };
    basket_payments?: { [id: string]: PaymentData };
    basket_payments_paymentMethod?: { [id: string]: PaymentMethodBaseData };
    basket_payments_paymentInstrument?: { [id: string]: PaymentInstrument };
  };
}
