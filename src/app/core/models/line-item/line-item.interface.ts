import { PriceItem } from 'ish-core/models/price-item/price-item.interface';
import { Price } from 'ish-core/models/price/price.model';

export interface LineItemData {
  id: string;
  calculated: boolean;
  position: number;
  quantity: {
    value: number;
    unit?: string;
  };
  product: string;

  surcharges?: [
    {
      amount: PriceItem;
      description?: string;
      name?: string;
    }
  ];
  discounts?: string[];
  pricing: {
    salesTaxTotal?: Price;
    shippingTaxTotal?: Price;
    shippingTotal: PriceItem;
    total: PriceItem;
    valueRebatesTotal?: PriceItem;
    price: PriceItem;
    undiscountedPrice: PriceItem;
    singleBasePrice: PriceItem;
  };
  hiddenGift: boolean;
  freeGift: boolean;
}
