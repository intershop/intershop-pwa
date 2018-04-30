import { Price } from '../price/price.model';
import { Product } from '../product/product.model';

export interface BasketItem {
  id: string;
  name: string;
  position: number;
  quantity: {
    type: string;
    value: number;
    unit?: string;
  };
  product: Product;
  price: Price;
  singleBasePrice: Price;
  itemSurcharges?: [
    {
      amount: Price;
      description?: string;
      displayName?: string;
    }
  ];
  /* ToDo: see #IS-23184  */
  valueRebates: [
    {
      amount: Price;
      description: string;
      name: string;
      rebateType: string;
    }
  ];
  isHiddenGift: boolean;
  isFreeGift: boolean;
  inStock: boolean;
  variationProduct: boolean;
  bundleProduct: boolean;
  availability: boolean;
}
