export interface PaypalClientConfig {
  singleProductCheckout?: boolean;
  googlePay?: {
    environment: 'TEST' | 'PRODUCTION';
    apiVersion: string;
  };
  applePay?: {
    apiVersion: string;
  };
}
