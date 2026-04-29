/**
 * PayPal Apple Pay component interface.
 * Provides methods to configure, confirm orders, and handle merchant validation.
 */
export interface PaypalApplePayComponent {
  /** Fetches the Apple Pay configuration from PayPal */
  config(): Promise<ApplePayConfig>;
  /** Confirms the order with PayPal after Apple Pay authorization */
  confirmOrder(params: unknown): Promise<unknown>;
  /** Validates the merchant with Apple Pay */
  validateMerchant(params: { validationUrl: string; domainName: string }): Promise<{ merchantSession: unknown }>;
}

/** Apple Pay configuration response from PayPal */
export interface ApplePayConfig {
  /** Whether Apple Pay is eligible for this merchant */
  isEligible: boolean;
  /** Country code for the merchant */
  countryCode: string;
  /** Merchant capabilities supported */
  merchantCapabilities: ('supports3DS' | 'supportsCredit' | 'supportsDebit' | 'supportsEMV')[];
  /** Supported card networks */
  supportedNetworks: string[];
}

export interface ApplePayPaymentAuthorizedEvent {
  payment: {
    token: unknown;
  };
}

export interface ApplePayPaymentRequest {
  countryCode: string;
  currencyCode: string;
  merchantCapabilities: ('supports3DS' | 'supportsCredit' | 'supportsDebit' | 'supportsEMV')[];
  supportedNetworks: string[];
  total: {
    label: string;
    amount: string;
    type?: 'final' | 'pending';
  };
}

/**
 * Apple Pay Session instance interface.
 * @see https://developer.apple.com/documentation/apple_pay_on_the_web/applepaysession
 */
export interface ApplePaySessionInstance {
  // Apple Pay API defines these as assignable callback properties, not methods
  onvalidatemerchant(event: { validationURL: string }): void;
  onpaymentauthorized(event: ApplePayPaymentAuthorizedEvent): void;
  onpaymentmethodselected(): void;
  oncancel(event: Event): void;
  begin(): void;
  abort(): void;
  completeMerchantValidation(merchantSession: unknown): void;
  completePaymentMethodSelection(result: { newTotal: ApplePayPaymentRequest['total'] }): void;
  completePayment(result: { status: number }): void;
}

/**
 * Apple Pay Session static interface with constructor.
 * @see https://developer.apple.com/documentation/apple_pay_on_the_web/applepaysession
 */
export interface ApplePaySessionStatic {
  STATUS_SUCCESS: number;
  STATUS_FAILURE: number;
  canMakePayments(): boolean;
  supportsVersion(version: number): boolean;
  new (version: number, paymentRequest: ApplePayPaymentRequest): ApplePaySessionInstance;
}
