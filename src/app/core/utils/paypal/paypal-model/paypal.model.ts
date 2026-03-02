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
  Applepay?(): PaypalApplePayComponent;
}

/**
 * PayPal Google Pay component interface.
 * Provides methods to configure, confirm orders, and handle 3D Secure authentication.
 */
export interface PaypalGooglePayComponent extends PaypalComponentBasics {
  /** Fetches the Google Pay configuration from PayPal */
  config(): Promise<GooglePayConfig>;
  /** Confirms the order with PayPal after Google Pay authorization */
  confirmOrder(params: GooglePayConfirmOrderParams): Promise<GooglePayConfirmOrderResponse>;
  /** Initiates 3D Secure payer action if required */
  initiatePayerAction(params: GooglePayInitiatePayerActionParams): Promise<GooglePayInitiatePayerActionResponse>;
}

/** Google Pay configuration response from PayPal */
export interface GooglePayConfig {
  /** Allowed payment methods for Google Pay */
  allowedPaymentMethods: GooglePayAllowedPaymentMethod[];
  /** Merchant information */
  merchantInfo: {
    merchantId?: string;
    merchantName?: string;
  };
}

/** Google Pay allowed payment method */
export interface GooglePayAllowedPaymentMethod {
  type: string;
  parameters: {
    allowedAuthMethods?: string[];
    allowedCardNetworks?: string[];
    [key: string]: unknown;
  };
  tokenizationSpecification?: {
    type: string;
    parameters: Record<string, unknown>;
  };
}

/** Parameters for confirming a Google Pay order */
export interface GooglePayConfirmOrderParams {
  orderId: string;
  paymentMethodData: GooglePayPaymentMethodData;
  shippingAddress?: Record<string, unknown>;
  billingAddress?: Record<string, unknown>;
  email?: string;
}

/** Google Pay payment method data from Google Pay response */
export interface GooglePayPaymentMethodData {
  type: string;
  description?: string;
  info?: {
    cardNetwork?: string;
    cardDetails?: string;
    billingAddress?: Record<string, unknown>;
  };
  tokenizationData?: {
    type: string;
    token: string;
  };
}

/** Response from PayPal confirmOrder */
export interface GooglePayConfirmOrderResponse {
  id: string;
  status: 'APPROVED' | 'PAYER_ACTION_REQUIRED' | 'COMPLETED' | string;
  payment_source?: Record<string, unknown>;
  links?: { href: string; rel: string; method: string }[];
}

/** Parameters for initiating payer action (3D Secure) */
export interface GooglePayInitiatePayerActionParams {
  orderId: string;
}

/** Response from initiatePayerAction */
export interface GooglePayInitiatePayerActionResponse {
  liabilityShift?: 'POSSIBLE' | 'NO' | 'UNKNOWN';
}

/** Google Pay payment data received from Google Pay sheet */
export interface GooglePayPaymentData {
  apiVersion: number;
  apiVersionMinor: number;
  paymentMethodData: GooglePayPaymentMethodData;
  shippingAddress?: Record<string, unknown>;
  email?: string;
}

/** Google Pay button options for creating the button */
export interface GooglePayButtonOptions {
  onClick(): void;
  allowedPaymentMethods: GooglePayAllowedPaymentMethod[];
  buttonColor?: 'default' | 'black' | 'white';
  buttonType?: 'book' | 'buy' | 'checkout' | 'donate' | 'order' | 'pay' | 'plain' | 'subscribe';
  buttonSizeMode?: 'static' | 'fill';
  buttonLocale?: string;
}

/** Google Pay payments client interface */
export interface GooglePayPaymentClient {
  isReadyToPay(request: {
    apiVersion: number;
    apiVersionMinor: number;
    allowedPaymentMethods: GooglePayAllowedPaymentMethod[];
  }): Promise<{ result: boolean }>;
  createButton(options: GooglePayButtonOptions): HTMLElement;
  loadPaymentData(request: unknown): Promise<GooglePayPaymentData>;
}

/** Google Pay payment data request interface */
export interface GooglePayPaymentDataRequest {
  apiVersion: number;
  apiVersionMinor: number;
  allowedPaymentMethods: GooglePayAllowedPaymentMethod[];
  merchantInfo: {
    merchantId?: string;
    merchantName?: string;
  };
  transactionInfo: {
    currencyCode: string;
    totalPriceStatus: 'FINAL' | 'ESTIMATED';
    totalPrice: string;
  };
  callbackIntents?: string[];
}
/** Google Pay payment authorization result */
export interface GooglePayPaymentAuthorizationResult {
  transactionState: 'SUCCESS' | 'ERROR';
  error?: {
    intent: string;
    message: string;
    reason: string;
  };
}

/**
 * PayPal Apple Pay component interface.
 * Provides methods to configure, validate merchant, and confirm orders.
 * @see {@link https://developer.paypal.com/docs/checkout/apm/apple-pay/}
 */
export interface PaypalApplePayComponent {
  /** Fetches the Apple Pay configuration from PayPal */
  config(): Promise<ApplePayConfig>;
  /** Validates the merchant session with Apple */
  validateMerchant(params: ApplePayValidateMerchantParams): Promise<ApplePayMerchantSession>;
  /** Confirms the order with PayPal after Apple Pay authorization */
  confirmOrder(params: ApplePayConfirmOrderParams): Promise<ApplePayConfirmOrderResponse>;
}

/** Apple Pay configuration response from PayPal */
export interface ApplePayConfig {
  /** Whether Apple Pay is eligible for this merchant */
  isEligible: boolean;
  /** Country code for the merchant (e.g., 'US', 'DE') */
  countryCode: string;
  /** Merchant capabilities for Apple Pay */
  merchantCapabilities: ApplePayMerchantCapability[];
  /** Supported payment networks */
  supportedNetworks: string[];
}

/** Apple Pay merchant capabilities */
export type ApplePayMerchantCapability = 'supports3DS' | 'supportsCredit' | 'supportsDebit' | 'supportsEMV';

/** Parameters for validating Apple Pay merchant */
export interface ApplePayValidateMerchantParams {
  /** The validation URL provided by Apple */
  validationUrl: string;
  /** Optional display name for the merchant */
  displayName?: string;
}

/** Apple Pay merchant session returned from PayPal */
export interface ApplePayMerchantSession {
  epochTimestamp: number;
  expiresAt: number;
  merchantSessionIdentifier: string;
  nonce: string;
  merchantIdentifier: string;
  domainName: string;
  displayName: string;
  signature: string;
}

/** Parameters for confirming an Apple Pay order */
export interface ApplePayConfirmOrderParams {
  /** PayPal order ID */
  orderId: string;
  /** Apple Pay token from payment authorization */
  token: ApplePayPaymentToken;
  /** Billing contact information */
  billingContact?: ApplePayPaymentContact;
  /** Shipping contact information */
  shippingContact?: ApplePayPaymentContact;
}

/** Apple Pay payment token */
export interface ApplePayPaymentToken {
  /** Payment method information */
  paymentMethod: {
    displayName: string;
    network: string;
    type: string;
  };
  /** Transaction identifier */
  transactionIdentifier: string;
  /** Encrypted payment data */
  paymentData: {
    data: string;
    signature: string;
    header: {
      publicKeyHash: string;
      ephemeralPublicKey: string;
      transactionId: string;
    };
    version: string;
  };
}

/** Apple Pay payment contact information */
export interface ApplePayPaymentContact {
  phoneNumber?: string;
  emailAddress?: string;
  givenName?: string;
  familyName?: string;
  phoneticGivenName?: string;
  phoneticFamilyName?: string;
  addressLines?: string[];
  subLocality?: string;
  locality?: string;
  postalCode?: string;
  subAdministrativeArea?: string;
  administrativeArea?: string;
  country?: string;
  countryCode?: string;
}

/** Response from PayPal confirmOrder for Apple Pay */
export interface ApplePayConfirmOrderResponse {
  id: string;
  status: 'APPROVED' | 'PAYER_ACTION_REQUIRED' | 'COMPLETED' | string;
  payment_source?: Record<string, unknown>;
  links?: { href: string; rel: string; method: string }[];
}

/** Apple Pay payment request for creating ApplePaySession */
export interface ApplePayPaymentRequest {
  /** Country code (e.g., 'US', 'DE') */
  countryCode: string;
  /** Currency code (e.g., 'USD', 'EUR') */
  currencyCode: string;
  /** Merchant capabilities */
  merchantCapabilities: ApplePayMerchantCapability[];
  /** Supported payment networks */
  supportedNetworks: string[];
  /** Required billing contact fields */
  requiredBillingContactFields?: ApplePayContactField[];
  /** Required shipping contact fields */
  requiredShippingContactFields?: ApplePayContactField[];
  /** Total payment amount */
  total: {
    label: string;
    amount: string;
    type?: 'final' | 'pending';
  };
}

/** Apple Pay contact field types */
export type ApplePayContactField = 'email' | 'name' | 'phone' | 'postalAddress' | 'phoneticName';

/** Apple Pay validate merchant event */
export interface ApplePayValidateMerchantEvent {
  validationURL: string;
}

/** Apple Pay payment authorized event */
export interface ApplePayPaymentAuthorizedEvent {
  payment: {
    token: ApplePayPaymentToken;
    billingContact?: ApplePayPaymentContact;
    shippingContact?: ApplePayPaymentContact;
  };
}

/** Apple Pay Session interface (native browser API) */
export interface ApplePaySession {
  begin(): void;
  abort(): void;
  completeMerchantValidation(merchantSession: ApplePayMerchantSession): void;
  completePayment(result: ApplePayPaymentAuthorizationResult): void;
  onvalidatemerchant: ((event: ApplePayValidateMerchantEvent) => void) | null;
  onpaymentauthorized: ((event: ApplePayPaymentAuthorizedEvent) => void) | null;
  oncancel: (() => void) | null;
}

/** Apple Pay payment authorization result */
export interface ApplePayPaymentAuthorizationResult {
  status: ApplePayPaymentAuthorizationStatus;
  errors?: ApplePayError[];
}

/** Apple Pay payment authorization status codes */
export type ApplePayPaymentAuthorizationStatus = 0 | 1 | 2 | 3 | 4 | 5;

/** Apple Pay error interface */
export interface ApplePayError {
  code: string;
  contactField?: ApplePayContactField;
  message?: string;
}

/** Apple Pay Session status constants */
export const APPLE_PAY_STATUS = {
  STATUS_SUCCESS: 0 as ApplePayPaymentAuthorizationStatus,
  STATUS_FAILURE: 1 as ApplePayPaymentAuthorizationStatus,
  STATUS_INVALID_BILLING_POSTAL_ADDRESS: 2 as ApplePayPaymentAuthorizationStatus,
  STATUS_INVALID_SHIPPING_POSTAL_ADDRESS: 3 as ApplePayPaymentAuthorizationStatus,
  STATUS_INVALID_SHIPPING_CONTACT: 4 as ApplePayPaymentAuthorizationStatus,
  STATUS_PIN_REQUIRED: 5 as ApplePayPaymentAuthorizationStatus,
};
