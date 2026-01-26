export enum ThreeDSecureDecisionStatus {
  ACCEPT = 'ACCEPT',
  DECLINE = 'DECLINE',
}

export interface Paypal3DsData {
  data: Paypal3Ds;
  infos?: Paypal3DsInfo[];
}

export interface Paypal3Ds {
  orderId: string;
  card?: Paypal3DSecureCardRO;
  redirect?: Paypal3DSecureRedirectRO;
  threeDSecureDecision?: ThreeDSecureDecisionStatus;
}

interface Paypal3DsInfo {
  code: string;
  message: string;
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
