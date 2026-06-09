import { PaypalApplePayComponent } from './paypal-apple-pay.model';
import { PaypalGooglePayComponent } from './paypal-google-pay.model';

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
    | 'Elo'
    | 'Hiper'
    | 'Hipercard'
    | 'JCB'
    | 'Maestro'
    | 'Mastercard'
    | 'UnionPay'
    | 'Visa';
  type:
    | 'american-express'
    | 'diners-club'
    | 'discover'
    | 'elo'
    | 'hiper'
    | 'hipercard'
    | 'jcb'
    | 'maestro'
    | 'mastercard'
    | 'unionpay'
    | 'visa';
}

export enum PaypalCardFieldError {
  InvalidCvv = 'INVALID_CVV',
  InvalidExpiry = 'INVALID_EXPIRY',
  InvalidName = 'INVALID_NAME',
  InvalidNumber = 'INVALID_NUMBER',
}

interface PaypalCardFieldCardFieldData {
  isFocused: boolean;
  isEmpty: boolean;
  isValid: boolean;
  isPotentiallyValid: boolean;
}

export interface PaypalStateObject {
  dispatching: boolean;
  error: null | string;
  rejected: boolean;
  resolved: boolean;
  value: PaypalCardFieldsStateObject;
}

export interface PaypalCardFieldsStateObject {
  cards: PaypalCardFieldsCardObject[];
  emittedBy?: 'cvv' | 'expiry' | 'name' | 'number';
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
  render(container: HTMLElement | string): Promise<void>;
  addClass(className: string): Promise<void>;
  clear(): void;
  focus(): void;
  removeAttribute(name: 'aria-invalid' | 'aria-required' | 'disabled' | 'placeholder'): Promise<void>;
  removeClass(className: string): Promise<void>;
  setAttribute(name: string, value: string): Promise<void>;
  setMessage(message: string): void;
  close(): Promise<void>;
}

export interface PaypalComponentBasics {
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
  Applepay?(options?: unknown): PaypalApplePayComponent;
}
