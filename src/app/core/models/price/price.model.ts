export interface Price {
  type: 'Money';
  value: number;
  currency: string;
}

export interface ScaledPrice extends Price {
  minQuantity: number;
}

export interface Pricing {
  listPrice: Price;
  salePrice: Price;
  scaledPrices: ScaledPrice[];
}

export * from './price.helper';
