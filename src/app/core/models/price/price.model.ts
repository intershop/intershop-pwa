export interface Price {
  type?: string;
  value: number;
  currencyMnemonic?: string;
  currency?: string;
}

export * from './price.helper';
