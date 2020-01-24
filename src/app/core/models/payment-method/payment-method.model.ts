import { FormlyFieldConfig } from '@ngx-formly/core';

import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';
import { PaymentRestriction } from 'ish-core/models/payment-restriction/payment-restriction.model';
import { Price } from 'ish-core/models/price/price.model';

export interface PaymentMethod {
  id: string;
  displayName: string;
  serviceId: string;
  saveAllowed?: boolean;
  description?: string;
  capabilities?: string[];
  paymentCosts?: Price;
  paymentCostsThreshold?: Price;
  isRestricted?: boolean;
  restrictionCauses?: PaymentRestriction[];
  paymentInstruments?: PaymentInstrument[];
  parameters?: FormlyFieldConfig[];
  hostedPaymentPageParameters?: { name: string; value: string }[];
}
