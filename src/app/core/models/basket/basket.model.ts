import { Dictionary } from '@ngrx/entity';
import { memoize } from 'lodash-es';

import { Address } from 'ish-core/models/address/address.model';
import { BasketApproval } from 'ish-core/models/basket-approval/basket-approval.model';
import { BasketInfo } from 'ish-core/models/basket-info/basket-info.model';
import { BasketTotal } from 'ish-core/models/basket-total/basket-total.model';
import { BasketValidationResultType } from 'ish-core/models/basket-validation/basket-validation.model';
import { LineItem, LineItemView } from 'ish-core/models/line-item/line-item.model';
import { Payment } from 'ish-core/models/payment/payment.model';
import { createProductView } from 'ish-core/models/product-view/product-view.model';
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
  customerNo?: string;
  lineItems?: T[];
  payment?: Payment;
  promotionCodes?: string[];
  totals: BasketTotal;
  totalProductQuantity?: number;
  bucketId?: string;
  infos?: BasketInfo[];
  approval?: BasketApproval;
}

export interface Basket extends AbstractBasket<LineItem> {}

export interface BasketView extends AbstractBasket<LineItemView> {}

export const createBasketView = memoize(
  (basket, products, validationResults, basketInfo, categoryTree): BasketView => {
    if (!basket) {
      return;
    }

    return {
      ...basket,
      lineItems: basket.lineItems
        ? basket.lineItems.map(li => ({
            ...li,
            product: createProductView(products[li.productSKU], categoryTree),
            name: products && products[li.productSKU] ? products[li.productSKU].name : undefined,
            inStock: products && products[li.productSKU] ? products[li.productSKU].inStock : undefined,
            availability: products && products[li.productSKU] ? products[li.productSKU].availability : undefined,
            validationError:
              validationResults && !validationResults.valid && validationResults.errors
                ? validationResults.errors.find(error => error.parameters && error.parameters.lineItemId === li.id)
                : undefined,
            info:
              basketInfo && basketInfo.length && basketInfo[0].causes
                ? basketInfo[0].causes.find(cause => cause.parameters && cause.parameters.lineItemId === li.id)
                : undefined,
          }))
        : [],
    };
  },
  // fire when basket line items or validation results changed
  (
    basket: Basket,
    products: Dictionary<Product | VariationProduct | VariationProductMaster>,
    validationResults: BasketValidationResultType,
    basketInfo: BasketInfo[]
  ): string =>
    basket &&
    JSON.stringify([basket, validationResults, basketInfo, ...basket.lineItems.map(li => products[li.productSKU])])
);
