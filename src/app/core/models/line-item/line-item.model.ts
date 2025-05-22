import { BasketFeedback } from 'ish-core/models/basket-feedback/basket-feedback.model';
import { BasketRebate } from 'ish-core/models/basket-rebate/basket-rebate.model';
import { BasketWarranty } from 'ish-core/models/basket-warranty/basket-warranty.model';
import { CustomFields } from 'ish-core/models/custom-field/custom-field.model';
import { PriceItem } from 'ish-core/models/price-item/price-item.model';
import { Price } from 'ish-core/models/price/price.model';
import { SkuQuantityType } from 'ish-core/models/product/product.model';

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
  undiscountedSingleBasePrice?: PriceItem;
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
  quote?: string;
  desiredDeliveryDate?: string;
  customFields?: CustomFields;
  warranty?: BasketWarranty;
}

export interface LineItemView extends LineItem {
  validationError?: BasketFeedback;
  info?: BasketFeedback;
}

export interface AddLineItemType extends SkuQuantityType {
  warrantySku?: string;
}
