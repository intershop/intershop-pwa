import { BasketFeedback } from 'ish-core/models/basket-feedback/basket-feedback.model';
import { BasketRebate } from 'ish-core/models/basket-rebate/basket-rebate.model';
import { PriceItem } from 'ish-core/models/price-item/price-item.model';
import { Price } from 'ish-core/models/price/price.model';

export interface LineItem {
  id: string;
  position: number;
  quantity: {
    type?: string;
    value: number;
    unit?: string;
  };
  productSKU: string;
  price: PriceItem;
  singleBasePrice: PriceItem;
  itemSurcharges?: {
    amount: PriceItem;
    description?: string;
    displayName?: string;
    text?: string;
  }[];
  valueRebates?: BasketRebate[];
  totals: {
    salesTaxTotal?: Price;
    shippingTaxTotal?: Price;
    shippingTotal: PriceItem;
    total: PriceItem;
    undiscountedTotal: PriceItem;
    valueRebatesTotal?: PriceItem;
  };
  isHiddenGift: boolean;
  isFreeGift: boolean;

  editable: boolean;
}

export interface LineItemView extends LineItem {
  validationError?: BasketFeedback;
  info?: BasketFeedback;
}
