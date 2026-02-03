export enum ThreeDSecureDecisionStatus {
  ACCEPT = 'ACCEPT',
  DECLINE = 'DECLINE',
}

export interface PaypalPaymentSourceData {
  data: PaypalPaymentSourceRO;
  infos?: PaypalPaymentSourceInfoRO[];
}

export interface PaypalPaymentSourceRO {
  orderId: string;
  card?: PaypalCardRO;
  experienceContext?: PaypalExperienceContextRO;
  name: string;
}

interface PaypalPaymentSourceInfoRO {
  code: string;
  message: string;
}

interface PaypalCardRO {
  brand: string;
  expiry: string;
  lastDigits: string;
  threeDSecureDecision?: ThreeDSecureDecisionStatus;
}

interface PaypalExperienceContextRO {
  cancelUrl?: string;
  returnUrl?: string;
}
