interface PaypalCardFieldsStyleOptions {
  appearance?: string;
  color?: string;
  direction?: string;
  font?: string;
  border?: string;
  borderRadius?: string;
  boxShadow?: string;
  'font-family'?: string;
  'font-size'?: string;
  'font-size-adjust'?: string;
  'font-stretch'?: string;
  'font-style'?: string;
  'font-variant'?: string;
  'font-variant-alternates'?: string;
  'font-variant-caps'?: string;
  'font-variant-east-asian'?: string;
  'font-variant-ligatures'?: string;
  'font-variant-numeric'?: string;
  'font-weight'?: string;
  'letter-spacing'?: string;
  'line-height'?: string;
  opacity?: string;
  outline?: string;
  padding?: string;
  'padding-bottom'?: string;
  'padding-left'?: string;
  'padding-right'?: string;
  'padding-top'?: string;
  'text-shadow'?: string;
  transition?: string;
  '-moz-appearance'?: string;
  '-moz-osx-font-smoothing'?: string;
  '-moz-tap-highlight-color'?: string;
  '-moz-transition'?: string;
  '-webkit-appearance'?: string;
  '-webkit-osx-font-smoothing'?: string;
  '-webkit-tap-highlight-color'?: string;
  '-webkit-transition'?: string;
}

interface PaypalCardFieldsInputEvents {
  onChange?(data: PaypalCardFieldsStateObject): void;
  onFocus?(data: PaypalCardFieldsStateObject): void;
  onBlur?(data: PaypalCardFieldsStateObject): void;
  onInputSubmitRequest?(data: PaypalCardFieldsStateObject): void;
}

interface PaypalCardFieldSecurityCode {
  code: string;
  size: number;
}

interface PaypalCardFieldsCardObject {
  code: PaypalCardFieldSecurityCode;
  niceType:
    | 'American Express'
    | 'Diners Club'
    | 'discover'
    | 'JCB'
    | 'Maestro'
    | 'Mastercard'
    | 'UnionPay'
    | 'Visa'
    | 'Elo'
    | 'Hiper'
    | 'Hipercard';
  type:
    | 'american-express'
    | 'diners-club'
    | 'discover'
    | 'jcb'
    | 'maestro'
    | 'mastercard'
    | 'unionpay'
    | 'visa'
    | 'elo'
    | 'hiper'
    | 'hipercard';
}

export enum PaypalCardFieldError {
  InvalidName = 'INVALID_NAME',
  InvalidNumber = 'INVALID_NUMBER',
  InvalidExpiry = 'INVALID_EXPIRY',
  InvalidCvv = 'INVALID_CVV',
}

interface PaypalCardFieldCardFieldData {
  isFocused: boolean;
  isEmpty: boolean;
  isValid: boolean;
  isPotentiallyValid: boolean;
}

export interface PaypalStateObject {
  dispatching: boolean;
  error: string | null;
  rejected: boolean;
  resolved: boolean;
  value: PaypalCardFieldsStateObject;
}

export interface PaypalCardFieldsStateObject {
  cards: PaypalCardFieldsCardObject[];
  emittedBy?: 'name' | 'number' | 'cvv' | 'expiry';
  isFormValid: boolean;
  errors: PaypalCardFieldError[];
  fields: {
    cardCvvField: PaypalCardFieldCardFieldData;
    cardNumberField: PaypalCardFieldCardFieldData;
    cardNameField: PaypalCardFieldCardFieldData;
    cardExpiryField: PaypalCardFieldCardFieldData;
  };
}

interface PaypalCardFieldsIndividualFieldOptions {
  placeholder?: string;
  inputEvents?: PaypalCardFieldsInputEvents;
  style?: Record<string, PaypalCardFieldsStyleOptions>;
}

export interface PaypalCardFieldsIndividualField {
  render(container: string | HTMLElement): Promise<void>;
  addClass(className: string): Promise<void>;
  clear(): void;
  focus(): void;
  removeAttribute(name: 'aria-invalid' | 'aria-required' | 'disabled' | 'placeholder'): Promise<void>;
  removeClass(className: string): Promise<void>;
  setAttribute(name: string, value: string): Promise<void>;
  setMessage(message: string): void;
  close(): Promise<void>;
}

interface PaypalComponentBasics {
  createOrder(): Promise<string>;
  onApprove(): void;
  onError(err: Record<string, unknown>): void;
  onCancel?(): Promise<void> | void;
  inputEvents?: PaypalCardFieldsInputEvents;
  style?: Record<string, PaypalCardFieldsStyleOptions>;
  render(selector?: string): Promise<void>;
}

export interface PaypalCardFieldsComponent extends PaypalComponentBasics {
  getState(): Promise<PaypalStateObject>;
  isEligible(): boolean;
  submit(): Promise<void>;
  NameField(options?: PaypalCardFieldsIndividualFieldOptions): PaypalCardFieldsIndividualField;
  NumberField(options?: PaypalCardFieldsIndividualFieldOptions): PaypalCardFieldsIndividualField;
  CVVField(options?: PaypalCardFieldsIndividualFieldOptions): PaypalCardFieldsIndividualField;
  ExpiryField(options?: PaypalCardFieldsIndividualFieldOptions): PaypalCardFieldsIndividualField;
}

/**
 * PayPal Google Pay component interface.
 * Provides methods to configure, confirm orders, and handle 3D Secure authentication.
 */
export interface PaypalGooglePayComponent extends PaypalComponentBasics {
  /** Fetches the Google Pay configuration from PayPal */
  config(): Promise<GooglePayConfig>;
  /** Confirms the order with PayPal after Google Pay authorization */
  confirmOrder(
    params: GooglePayConfirmOrderParams
  ): Promise<{ status: 'APPROVED' | 'PAYER_ACTION_REQUIRED' | 'COMPLETED' | string }>;
  /** Initiates 3D Secure payer action if required */
  initiatePayerAction(params: { orderId: string }): Promise<{ liabilityShift?: 'POSSIBLE' | 'NO' | 'UNKNOWN' }>;
}

/** Google Pay configuration response from PayPal */
export interface GooglePayConfig {
  /** Allowed payment methods for Google Pay */
  allowedPaymentMethods: unknown;
  /** Merchant information */
  merchantInfo: {
    merchantId?: string;
    merchantName?: string;
  };
}

/** Parameters for confirming a Google Pay order */
interface GooglePayConfirmOrderParams {
  orderId: string;
  paymentMethodData: unknown;
  shippingAddress?: Record<string, unknown>;
  billingAddress?: Record<string, unknown>;
  email?: string;
}

/** Google Pay button options for creating the button */
export interface GooglePayButton {
  onClick(): void;
  allowedPaymentMethods: unknown;
  buttonColor?: string;
  buttonType?: string;
  buttonSizeMode?: string;
  buttonLocale?: string;
}

/** Google Pay payments client interface */
export interface GooglePayPaymentClient {
  isReadyToPay(request: {
    apiVersion: number;
    apiVersionMinor: number;
    allowedPaymentMethods: unknown;
  }): Promise<{ result: boolean }>;
  createButton(options: GooglePayButton): HTMLElement;
  loadPaymentData(request: unknown): Promise<unknown>;
}

/** Google Pay payment authorization result */
export interface GooglePayPaymentAuthorizationResult {
  transactionState: 'SUCCESS' | 'ERROR';
  error?: {
    intent: string;
    message: string;
  };
}

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
  // eslint-disable-next-line @typescript-eslint/method-signature-style
  onvalidatemerchant: (event: { validationURL: string }) => void;
  // eslint-disable-next-line @typescript-eslint/method-signature-style
  onpaymentauthorized: (event: ApplePayPaymentAuthorizedEvent) => void;
  // eslint-disable-next-line @typescript-eslint/method-signature-style
  onpaymentmethodselected: () => void;
  // eslint-disable-next-line @typescript-eslint/method-signature-style
  oncancel: (event: Event) => void;
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

export interface PaypalComponent {
  /** Creates PayPal payment buttons with checkout functionality */
  Buttons(options: unknown): PaypalComponentBasics;
  /** Creates PayPal promotional messages (optional, not all SDK versions include this) */
  Messages?(options: unknown): PaypalComponentBasics;
  /** Creates PayPal payment marks for alternative payment methods */
  Marks(options: unknown): PaypalComponentBasics;
  /** Creates PayPal hosted card input fields */
  CardFields?(options?: unknown): PaypalCardFieldsComponent;
  /** Creates PayPal Google Pay component */
  Googlepay?(options?: unknown): PaypalGooglePayComponent;
  /** Creates PayPal Apple Pay component */
  Applepay?(options?: unknown): PaypalApplePayComponent;
}
