import { PaypalComponentBasics } from './paypal.model';

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
