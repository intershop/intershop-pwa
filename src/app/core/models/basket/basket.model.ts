import { Dictionary } from '@ngrx/entity';
import { memoize } from 'lodash-es';

import { Address } from 'ish-core/models/address/address.model';
import { BasketTotal } from 'ish-core/models/basket-total/basket-total.model';
import { LineItem, LineItemView } from 'ish-core/models/line-item/line-item.model';
import { Payment } from 'ish-core/models/payment/payment.model';
import { VariationProductMaster } from 'ish-core/models/product/product-variation-master.model';
import { VariationProduct } from 'ish-core/models/product/product-variation.model';
import { Product } from 'ish-core/models/product/product.model';
import { ShippingMethod } from 'ish-core/models/shipping-method/shipping-method.model';

interface AbstractBasket<T> {
  id: string;
  purchaseCurrency?: string;
  dynamicMessages?: string[];
  invoiceToAddress?: Address;
  commonShipToAddress?: Address;
  commonShippingMethod?: ShippingMethod;
  lineItems?: T[];
  payment?: Payment;
  promotionCodes?: string[];
  totals: BasketTotal;
  totalProductQuantity?: number;
}

export interface Basket extends AbstractBasket<LineItem> {}

export interface BasketView extends AbstractBasket<LineItemView> {}

export const createBasketView = memoize(
  (basket, products): BasketView => {
    if (!basket) {
      return;
    }

    return {
      ...basket,
      lineItems: basket.lineItems
        ? basket.lineItems.map(li => ({
            ...li,
            product: products[li.productSKU],
            name: products && products[li.productSKU] ? products[li.productSKU].name : undefined,
            inStock: products && products[li.productSKU] ? products[li.productSKU].inStock : undefined,
            availability: products && products[li.productSKU] ? products[li.productSKU].availability : undefined,
          }))
        : [],
    };
  },
  // fire when basket or line items changed
  (basket: Basket, products: Dictionary<Product | VariationProduct | VariationProductMaster>): string =>
    basket && JSON.stringify([basket, ...basket.lineItems.map(li => products[li.productSKU])])
);
