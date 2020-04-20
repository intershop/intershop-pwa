import { PriceItemData } from 'ish-core/models/price-item/price-item.interface';
import { PriceData } from 'ish-core/models/price/price.interface';

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
      amount: PriceItemData;
      description?: string;
      name?: string;
    }
  ];
  discounts?: string[];
  pricing: {
    salesTaxTotal?: PriceData;
    shippingTaxTotal?: PriceData;
    shippingTotal: PriceItemData;
    total: PriceItemData;
    valueRebatesTotal?: PriceItemData;
    price: PriceItemData;
    undiscountedPrice: PriceItemData;
    singleBasePrice: PriceItemData;
  };
  hiddenGift: boolean;
  freeGift: boolean;
  quantityFixed?: boolean;
}
