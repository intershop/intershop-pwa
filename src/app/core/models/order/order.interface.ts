import { AddressData } from '../address/address.interface';
import { BasketRebateData } from '../basket-rebate/basket-rebate.interface';
import { BasketBaseData } from '../basket/basket.interface';
import { OrderItemData } from '../order-item/order-item.interface';
import { PaymentInstrument } from '../payment-instrument/payment-instrument.model';
import { PaymentMethodBaseData } from '../payment-method/payment-method.interface';
import { PaymentData } from '../payment/payment.interface';
import { ShippingMethodData } from '../shipping-method/shipping-method.interface';

// tslint:disable-next-line:project-structure
export interface OrderBaseData extends BasketBaseData {
  documentNumber: string;
  creationDate: Date;
  orderCreation: {
    status: 'COMPLETED' | 'ROLLED_BACK' | 'STOPPED' | 'CONTINUE';
    stopAction?: {
      type: 'Redirect' | 'Workflow';
      exitReason?: 'waiting_for_pending_payments' | 'redirect_urls_required';
      redirectUrl?: string;
    };
  };
  statusCode: string;
  status: string;
}

export interface OrderData {
  data: OrderBaseData | OrderBaseData[];
  included?: {
    invoiceToAddress?: { [urn: string]: AddressData };
    lineItems?: { [id: string]: OrderItemData };
    discounts?: { [id: string]: BasketRebateData };
    lineItems_discounts?: { [id: string]: BasketRebateData };
    commonShipToAddress?: { [urn: string]: AddressData };
    commonShippingMethod?: { [id: string]: ShippingMethodData };
    payments?: { [id: string]: PaymentData };
    payments_paymentMethod?: { [id: string]: PaymentMethodBaseData };
    payments_paymentInstrument?: { [id: string]: PaymentInstrument };
  };
}
