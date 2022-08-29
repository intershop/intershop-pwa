export type PriceUpdateType = 'stable' | 'always';

export interface Price {
  type: 'Money';
  value: number;
  currency: string;
}

export interface ScaledPrice extends Price {
  minQuantity: number;
}

export interface Pricing {
  listPrice?: Price;
  salePrice?: Price;
  scaledPrices?: ScaledPrice[];
  minSalePrice?: Price;
  minListPrice?: Price;
  maxSalePrice?: Price;
  maxListPrice?: Price;
  summedUpSalePrice?: Price;
  summedUpListPrice?: Price;
}

export * from './price.helper';
