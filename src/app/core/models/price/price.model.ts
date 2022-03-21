export interface Price {
  type: 'Money';
  value: number;
  currency: string;
}

export interface ScaledPrice extends Price {
  minQuantity: number;
}

export * from './price.helper';
