import { BasketRebate } from '../basket-rebate/basket-rebate.model';
import { Link } from '../link/link.model';
import { Price } from '../price/price.model';

export interface OrderItemData {
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
  availability: boolean;
}
