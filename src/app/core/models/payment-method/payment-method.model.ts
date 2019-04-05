import { FormlyFieldConfig } from '@ngx-formly/core';

import { PaymentInstrument } from '../payment-instrument/payment-instrument.model';
import { PaymentRestriction } from '../payment-restriction/payment-restriction.model';
import { Price } from '../price/price.model';

export interface PaymentMethod {
  id: string;
  displayName: string;
  description?: string;
  capabilities?: string[];
  paymentCosts?: Price;
  paymentCostsThreshold?: Price;
  isRestricted?: boolean;
  restrictionCauses?: PaymentRestriction[];
  paymentInstruments?: PaymentInstrument[];
  parameters?: FormlyFieldConfig[];
}
