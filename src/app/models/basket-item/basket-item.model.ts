import { BasketRebate } from '../basket-rebate/basket-rebate.model';
import { Price } from '../price/price.model';

export interface BasketItem {
  id: string;
  name: string;
  position: number;
  quantity: {
    type: string;
    value: number;
    unit?: string;
  };
  productSKU: string;
  price: Price;
  singleBasePrice: Price;
  itemSurcharges?: [
    {
      amount: Price;
      description?: string;
      displayName?: string;
    }
  ];
  valueRebates?: BasketRebate[];
  totals: {
    salesTaxTotal?: Price;
    shippingTaxTotal?: Price;
    shippingTotal: Price;
    total: Price;
    valueRebatesTotal?: Price;
  };
  isHiddenGift: boolean;
  isFreeGift: boolean;
  inStock: boolean;
  variationProduct: boolean;
  bundleProduct: boolean;
  availability: boolean;
}
