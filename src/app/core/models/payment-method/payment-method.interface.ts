import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';
import { PaymentRestriction } from 'ish-core/models/payment-restriction/payment-restriction.model';
import { PriceItemData } from 'ish-core/models/price-item/price-item.interface';

export interface PaymentMethodParameterType {
  type: string;
  name: string;
  displayName: string;
  description?: string;
  hidden?: boolean;
  options?: { displayName: string; id: string }[];
  constraints?: {
    required?: { message?: string };
    size?: { min?: number; max?: number; message?: string };
    pattern?: { regexp: string; message?: string };
  };
}

export interface PaymentMethodBaseData {
  id: string;
  serviceID: string;
  displayName: string;
  description?: string;
  capabilities?: string[];
  saveAllowed: boolean;
  restricted?: boolean;
  restrictions?: PaymentRestriction[];
  paymentCosts?: PriceItemData;
  paymentCostsThreshold?: PriceItemData;
  paymentInstruments?: string[];
  parameterDefinitions?: PaymentMethodParameterType[];
  hostedPaymentPageParameters?: { name: string; value: string }[];
}

export interface PaymentMethodData {
  data: PaymentMethodBaseData[];
  included: {
    paymentInstruments: {
      [id: string]: PaymentInstrument;
    };
  };
}

/**
 * user payment interface
 */
export interface PaymentMethodOptionsDataType {
  payments: PaymentMethodBaseData[];
}
