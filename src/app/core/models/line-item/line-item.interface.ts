import { BasketRebateData } from '../basket-rebate/basket-rebate.interface';
import { PriceItem } from '../price-item/price-item.interface';
import { Price } from '../price/price.model';

export interface LineItemData {
  id: string;
  calculated: boolean;
  position: number;
  quantity: {
    value: number;
    unit?: string;
  };
  product: string;
  price: PriceItem;

  surcharges?: [
    {
      amount: PriceItem;
      description?: string;
      name?: string;
    }
  ];
  discounts?: BasketRebateData[];
  singleBasePrice: PriceItem;
  totals: {
    salesTaxTotal?: Price;
    shippingTaxTotal?: Price;
    shippingTotal: PriceItem;
    total: PriceItem;
    valueRebatesTotal?: PriceItem;
  };
  hiddenGift: boolean;
  freeGift: boolean;
}
