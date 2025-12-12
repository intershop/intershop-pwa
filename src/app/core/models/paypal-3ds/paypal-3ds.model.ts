export interface Paypal3Ds {
  orderId: string;
  card?: Paypal3DSecureCardRO;
  redirect?: Paypal3DSecureRedirectRO;
}

interface Paypal3DSecureCardRO {
  brand: string;
  expiry: string;
  lastDigits: string;
  name: string;
  cancelUrl?: string;
  returnUrl?: string;
}

interface Paypal3DSecureRedirectRO {
  cancelUrl?: string;
  returnUrl?: string;
}
