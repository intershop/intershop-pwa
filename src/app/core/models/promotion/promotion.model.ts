export interface Promotion {
  id: string;
  name: string;
  couponCodeRequired?: boolean;
  currency: string;
  promotionType: string;
  description?: string;
  icon?: string;
  legalContentMessage?: string;
  longTitle?: string;
  ruleDescription?: string;
  title?: string;
  useExternalUrl?: boolean;
  externalUrl?: string;
  disableMessages: boolean;
}
