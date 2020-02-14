import { BasketFeedback } from 'ish-core/models/basket-feedback/basket-feedback.model';
import { BasketRebate } from 'ish-core/models/basket-rebate/basket-rebate.model';
import { Price } from 'ish-core/models/price/price.model';
import { ProductView } from 'ish-core/models/product-view/product-view.model';

export interface LineItem {
  id: string;
  position: number;
  quantity: {
    type?: string;
    value: number;
    unit?: string;
  };
  productSKU: string;
  price: Price;
  singleBasePrice: Price;
  itemSurcharges?: {
    amount: Price;
    description?: string;
    displayName?: string;
    text?: string;
  }[];
  valueRebates?: BasketRebate[];
  totals: {
    salesTaxTotal?: Price;
    shippingTaxTotal?: Price;
    shippingTotal: Price;
    total: Price;
    undiscountedTotal;
    valueRebatesTotal?: Price;

    // attributes needed for quote feature
    originTotal?: Price;
  };
  isHiddenGift: boolean;
  isFreeGift: boolean;

  // attributes needed for order line items
  name?: string;
  description?: string;
  fulfillmentStatus?: string;

  // attributes needed for quote feature
  originSingleBasePrice?: Price;
}

export interface LineItemView extends LineItem {
  product: ProductView;
  validationError?: BasketFeedback;
  info?: BasketFeedback;
}
