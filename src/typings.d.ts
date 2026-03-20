declare module 'express-robots-txt';

declare const PRODUCTION_MODE: boolean;

declare const SERVICE_WORKER: boolean;

declare const NGRX_RUNTIME_CHECKS: boolean;

declare const PWA_VERSION: string;

declare const THEME: string;

declare const SSR: boolean;

// Apple Pay Session type declarations for Apple Pay integration
// @see https://developer.apple.com/documentation/apple_pay_on_the_web/applepaysession
interface ApplePayPaymentContact {
  givenName?: string;
  familyName?: string;
  emailAddress?: string;
  phoneNumber?: string;
  addressLines?: string[];
  locality?: string;
  administrativeArea?: string;
  postalCode?: string;
  countryCode?: string;
}

interface ApplePayPaymentToken {
  paymentData: {
    data: string;
    header: {
      ephemeralPublicKey: string;
      publicKeyHash: string;
      transactionId: string;
    };
    signature: string;
    version: string;
  };
  paymentMethod: {
    displayName: string;
    network: string;
    type: string;
  };
  transactionIdentifier: string;
}

interface ApplePayPaymentAuthorizedEvent {
  payment: {
    token: ApplePayPaymentToken;
    billingContact?: ApplePayPaymentContact;
    shippingContact?: ApplePayPaymentContact;
  };
}

interface ApplePayPaymentRequest {
  countryCode: string;
  currencyCode: string;
  merchantCapabilities: ('supports3DS' | 'supportsCredit' | 'supportsDebit' | 'supportsEMV')[];
  supportedNetworks: string[];
  total: {
    label: string;
    amount: string;
    type?: 'final' | 'pending';
  };
  requiredBillingContactFields?: ('email' | 'name' | 'phone' | 'postalAddress' | 'phoneticName')[];
  requiredShippingContactFields?: ('email' | 'name' | 'phone' | 'postalAddress' | 'phoneticName')[];
}

/* eslint-disable @typescript-eslint/member-ordering */
declare class ApplePaySession {
  static STATUS_SUCCESS: number;
  static STATUS_FAILURE: number;
  static canMakePayments(): boolean;
  static supportsVersion(version: number): boolean;

  onvalidatemerchant: (event: { validationURL: string }) => void;
  onpaymentauthorized: (event: ApplePayPaymentAuthorizedEvent) => void;
  onpaymentmethodselected: () => void;
  oncancel: (event: Event) => void;

  constructor(version: number, paymentRequest: ApplePayPaymentRequest);
  begin(): void;
  abort(): void;
  completeMerchantValidation(merchantSession: unknown): void;
  completePaymentMethodSelection(result: { newTotal: ApplePayPaymentRequest['total'] }): void;
  completePayment(result: { status: number }): void;
}
/* eslint-enable @typescript-eslint/member-ordering */
