export type PriceType = 'gross' | 'net';

export interface Price {
  type?: 'Money' | 'ProductPrice';
  value: number;
  currency: string;
}

export * from './price.helper';
