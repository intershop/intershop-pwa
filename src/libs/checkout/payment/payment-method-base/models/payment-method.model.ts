import { PaymentInstrument } from '@intershop-pwa/checkout/payment/payment-method-base/models/payment-instrument.model';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { PaymentRestriction } from 'ish-core/models/payment-restriction/payment-restriction.model';
import { PriceItem } from 'ish-core/models/price-item/price-item.model';

export interface PaymentMethod {
  id: string;
  displayName: string;
  serviceId: string;
  saveAllowed?: boolean;
  description?: string;
  capabilities?: string[];
  paymentCosts?: PriceItem;
  paymentCostsThreshold?: PriceItem;
  isRestricted?: boolean;
  restrictionCauses?: PaymentRestriction[];
  paymentInstruments?: PaymentInstrument[];
  parameters?: FormlyFieldConfig[];
  hostedPaymentPageParameters?: { name: string; value: string }[];
}
