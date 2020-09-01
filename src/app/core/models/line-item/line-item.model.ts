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
    undiscountedTotal;
    valueRebatesTotal?: PriceItem;

    // attributes needed for quote feature
    originTotal?: PriceItem;
  };
  isHiddenGift: boolean;
  isFreeGift: boolean;

  // attributes needed for order line items
  name?: string;
  description?: string;
  fulfillmentStatus?: string;

  // attributes needed for quote feature
  originSingleBasePrice?: PriceItem;

  isQuantityFixed?: boolean;
}

export interface LineItemView extends LineItem {
  validationError?: BasketFeedback;
  info?: BasketFeedback;
}
