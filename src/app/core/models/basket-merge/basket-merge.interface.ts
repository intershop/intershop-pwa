import { AddressData } from '../address/address.interface';
import { BasketRebateData } from '../basket-rebate/basket-rebate.interface';
import { BasketBaseData } from '../basket/basket.interface';
import { LineItemData } from '../line-item/line-item.interface';
import { PaymentInstrument } from '../payment-instrument/payment-instrument.model';
import { PaymentMethodBaseData } from '../payment-method/payment-method.interface';
import { PaymentData } from '../payment/payment.interface';
import { ShippingMethodData } from '../shipping-method/shipping-method.interface';

// tslint:disable-next-line:project-structure
export interface MergeBaseData {
  sourceBasket: string;
  targetBasket: string;
}

export interface BasketMergeData {
  data: MergeBaseData;
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
