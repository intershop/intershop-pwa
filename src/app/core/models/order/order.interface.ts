import { AddressData } from 'ish-core/models/address/address.interface';
import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { BasketInfo } from 'ish-core/models/basket-info/basket-info.model';
import { BasketRebateData } from 'ish-core/models/basket-rebate/basket-rebate.interface';
import { BasketWarrantyData } from 'ish-core/models/basket-warranty/basket-warranty.interface';
import { BasketBaseData } from 'ish-core/models/basket/basket.interface';
import { OrderItemData } from 'ish-core/models/order-item/order-item.interface';
import { PagingInfo } from 'ish-core/models/paging-info/paging-info.model';
import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';
import { PaymentMethodBaseData } from 'ish-core/models/payment-method/payment-method.interface';
import { PaymentData } from 'ish-core/models/payment/payment.interface';
import { ShippingMethodData } from 'ish-core/models/shipping-method/shipping-method.interface';
import { WithdrawalInfo } from 'ish-core/models/withdrawal-info/withdrawal-info.model';

export type OrderCreationStatus = 'COMPLETED' | 'CONTINUE' | 'ROLLED_BACK' | 'STOPPED';

export type OrderStopActionReason =
  'paypal_wallet_initialized' | 'recurring.order' | 'redirect_urls_required' | 'waiting_for_pending_payments';

export interface OrderBaseData extends BasketBaseData {
  documentNumber: string;
  creationDate: string;
  orderCreation: {
    status: OrderCreationStatus;
    stopAction?: {
      type: 'Redirect' | 'Workflow';
      exitReason?: OrderStopActionReason;
      redirectUrl?: string;
    };
    redirect?: {
      parameters: {
        name: string;
        value: string;
      }[];
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
    invoiceToAddress?: Record<string, AddressData>;
    lineItems?: Record<string, OrderItemData>;
    discounts?: Record<string, BasketRebateData>;
    lineItems_discounts?: Record<string, BasketRebateData>;
    lineItems_warranty?: Record<string, BasketWarrantyData>;
    commonShipToAddress?: Record<string, AddressData>;
    commonShippingMethod?: Record<string, ShippingMethodData>;
    payments?: Record<string, PaymentData>;
    payments_paymentMethod?: Record<string, PaymentMethodBaseData>;
    payments_paymentInstrument?: Record<string, PaymentInstrument>;
    withdrawal?: Record<string, WithdrawalInfo>;
  };
  infos?: BasketInfo[];
  info?: PagingInfo;
}
