export interface PaypalConfig {
  clientId: string;
  merchantId: string;
  payLaterPreferences?: {
    PayLaterEnabled: boolean;
    PayLaterMessagingCartEnabled: boolean;
    PayLaterMessagingCategoryEnabled: boolean;
    PayLaterMessagingHomeEnabled: boolean;
    PayLaterMessagingPaymentEnabled: boolean;
    PayLaterMessagingProductDetailsEnabled: boolean;
  };
}

export interface PaypalClientConfig {
  googlePayEnvironment: 'PRODUCTION' | 'TEST';
}
