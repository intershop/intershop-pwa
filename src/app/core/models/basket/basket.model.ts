import { Dictionary } from '@ngrx/entity';
import { memoize } from 'lodash-es';

import { Address } from '../address/address.model';
import { BasketTotal } from '../basket-total/basket-total.model';
import { LineItem, LineItemView } from '../line-item/line-item.model';
import { Payment } from '../payment/payment.model';
import { VariationProductMaster } from '../product/product-variation-master.model';
import { VariationProduct } from '../product/product-variation.model';
import { Product } from '../product/product.model';
import { ShippingMethod } from '../shipping-method/shipping-method.model';

interface AbstractBasket<T> {
  id: string;
  purchaseCurrency?: string;
  dynamicMessages?: string[];
  invoiceToAddress?: Address;
  commonShipToAddress?: Address;
  commonShippingMethod?: ShippingMethod;
  payment?: Payment;
  lineItems?: T[];
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
