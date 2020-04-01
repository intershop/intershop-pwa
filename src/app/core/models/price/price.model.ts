export interface Price {
  type: 'Money';
  value: number;
  currency: string;
}

export * from './price.helper';
