import { Dictionary } from '@ngrx/entity';
import { memoize } from 'lodash-es';

import { Basket, BasketView } from 'ish-core/models/basket/basket.model';
import { createProductView } from 'ish-core/models/product-view/product-view.model';
import { VariationProductMaster } from 'ish-core/models/product/product-variation-master.model';
import { VariationProduct } from 'ish-core/models/product/product-variation.model';
import { Product } from 'ish-core/models/product/product.model';

export interface AbstractOrder {
  documentNo: string;
  creationDate: number;
  orderCreation: {
    status: 'COMPLETED' | 'ROLLED_BACK' | 'STOPPED' | 'CONTINUE';
    stopAction?: {
      type: 'Redirect' | 'Workflow';
      exitReason?: 'waiting_for_pending_payments' | 'redirect_urls_required';
      redirectUrl?: string;
    };
  };
  statusCode: string;
  status: string;
}

export interface Order extends Basket, AbstractOrder {}

export interface OrderView extends BasketView, AbstractOrder {}

export const createOrderView = memoize(
  (order, products, categoryTree): OrderView => {
    if (!order) {
      return;
    }

    return {
      ...order,
      lineItems: order.lineItems
        ? order.lineItems.map(li => ({
            ...li,
            product: products ? createProductView(products[li.productSKU], categoryTree) : undefined,
          }))
        : [],
    };
  },
  // fire when basket or line items changed
  (order: Order, products: Dictionary<Product | VariationProduct | VariationProductMaster>): string =>
    order && JSON.stringify([order, ...order.lineItems.map(li => products[li.productSKU])])
);
