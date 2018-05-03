import { Link } from '../link/link.model';
import { Price } from '../price/price.model';

export interface BasketItemData {
  id: string;
  name: string;
  position: number;
  quantity: {
    type: string;
    value: number;
    unit?: string;
  };
  product: Link;
  price: Price;
  singleBasePrice: Price;
  itemSurcharges?: [
    {
      amount: Price;
      description?: string;
      displayName?: string;
    }
  ];
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
