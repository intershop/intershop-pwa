import { FormlyFieldConfig } from '@ngx-formly/core';

import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';
import { PaymentRestriction } from 'ish-core/models/payment-restriction/payment-restriction.model';
import { PriceItem } from 'ish-core/models/price-item/price-item.model';

export interface PaymentMethod {
  id: string;
  displayName: string;
  serviceId: string;
  saveAllowed?: boolean;
  description?: string;
  capabilities?: string[]; // currently supported 'RedirectBeforeCheckout', 'PaypalCheckout', 'RedirectAfterCheckout', 'FastCheckout'
  paymentCosts?: PriceItem;
  paymentCostsThreshold?: PriceItem;
  isRestricted?: boolean;
  restrictionCauses?: PaymentRestriction[];
  paymentInstruments?: PaymentInstrument[];
  parameters?: FormlyFieldConfig[];
  hostedPaymentPageParameters?: Attribute<string>[];
  hasParameters?: boolean; // Needed for old payment method user REST api
}
