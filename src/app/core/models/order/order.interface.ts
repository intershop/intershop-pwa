import { AddressData } from 'ish-core/models/address/address.interface';
import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { BasketInfo } from 'ish-core/models/basket-info/basket-info.model';
import { BasketRebateData } from 'ish-core/models/basket-rebate/basket-rebate.interface';
import { BasketWarrantyData } from 'ish-core/models/basket-warranty/basket-warranty.interface';
import { BasketBaseData } from 'ish-core/models/basket/basket.interface';
import { OrderItemData } from 'ish-core/models/order-item/order-item.interface';
import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';
import { PaymentMethodBaseData } from 'ish-core/models/payment-method/payment-method.interface';
import { PaymentData } from 'ish-core/models/payment/payment.interface';
import { ShippingMethodData } from 'ish-core/models/shipping-method/shipping-method.interface';

export interface OrderBaseData extends BasketBaseData {
  documentNumber: string;
  creationDate: string;
  orderCreation: {
    status: 'COMPLETED' | 'ROLLED_BACK' | 'STOPPED' | 'CONTINUE';
    stopAction?: {
      type: 'Redirect' | 'Workflow';
      exitReason?: 'waiting_for_pending_payments' | 'redirect_urls_required' | 'recurring.order';
      redirectUrl?: string;
    };
  };
  statusCode: string;
  status: string;
  basket: string;
  requisitionDocumentNo?: string;
  recurringOrderID?: string;
  attributes?: Attribute[];
  taxIdentificationNumber?: string;
}

export interface OrderData {
  data: OrderBaseData | OrderBaseData[];
  included?: {
    invoiceToAddress?: { [urn: string]: AddressData };
    lineItems?: { [id: string]: OrderItemData };
    discounts?: { [id: string]: BasketRebateData };
    lineItems_discounts?: { [id: string]: BasketRebateData };
    lineItems_warranty?: { [id: string]: BasketWarrantyData };
    commonShipToAddress?: { [urn: string]: AddressData };
    commonShippingMethod?: { [id: string]: ShippingMethodData };
    payments?: { [id: string]: PaymentData };
    payments_paymentMethod?: { [id: string]: PaymentMethodBaseData };
    payments_paymentInstrument?: { [id: string]: PaymentInstrument };
  };
  infos?: BasketInfo[];
}
