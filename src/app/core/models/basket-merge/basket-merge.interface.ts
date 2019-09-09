import { AddressData } from 'ish-core/models/address/address.interface';
import { BasketRebateData } from 'ish-core/models/basket-rebate/basket-rebate.interface';
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
    targetBasket: { [id: string]: BasketBaseData };
    targetBasket_invoiceToAddress?: { [urn: string]: AddressData };
    targetBasket_lineItems?: { [id: string]: LineItemData };
    targetBasket_discounts?: { [id: string]: BasketRebateData };
    targetBasket_lineItems_discounts?: { [id: string]: BasketRebateData };
    targetBasket_commonShipToAddress?: { [urn: string]: AddressData };
    targetBasket_commonShippingMethod?: { [id: string]: ShippingMethodData };
    targetBasket_payments?: { [id: string]: PaymentData };
    targetBasket_payments_paymentMethod?: { [id: string]: PaymentMethodBaseData };
    targetBasket_payments_paymentInstrument?: { [id: string]: PaymentInstrument };
  };
}
