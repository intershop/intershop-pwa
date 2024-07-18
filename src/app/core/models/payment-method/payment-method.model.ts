import { FormlyFieldConfig } from '@ngx-formly/core';

import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';
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
  hasParameters?: boolean; // Needed for old payment method user REST api
}

export interface CheckoutPaymentCondition {
  checkoutStep: string;
  isGuestCheckoutEnabled?: boolean;
  anonymous?: boolean;
  appliedPaymentInstrumentId?: string;
}

enum PaymentMethodType {
  FastCheckout = 'FastCheckout',
  RedirectBeforeCheckout = 'RedirectBeforeCheckout',
  RedirectAfterCheckout = 'RedirectAfterCheckout',
  WithoutRedirect = '',
}

export const PAYMENT_METHOD_TYPE_CHECKOUT_ASSIGNMENT = new Map<string, PaymentMethodType[]>([
  ['basket', [PaymentMethodType.FastCheckout]],
  [
    'payment',
    [
      PaymentMethodType.RedirectBeforeCheckout,
      PaymentMethodType.RedirectAfterCheckout,
      PaymentMethodType.WithoutRedirect,
    ],
  ],
]);
