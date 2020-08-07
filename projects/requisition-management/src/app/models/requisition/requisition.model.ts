import { Dictionary } from '@ngrx/entity';
import { memoize } from 'lodash-es';

import { Basket, BasketView } from 'ish-core/models/basket/basket.model';
import { Price } from 'ish-core/models/price/price.model';
import { createProductView } from 'ish-core/models/product-view/product-view.model';
import { VariationProductMaster } from 'ish-core/models/product/product-variation-master.model';
import { VariationProduct } from 'ish-core/models/product/product-variation.model';
import { Product } from 'ish-core/models/product/product.model';
import { User } from 'ish-core/models/user/user.model';

export type RequisitionStatus = 'pending' | 'approved' | 'rejected';

export type RequisitionViewer = 'buyer' | 'approver';

export interface RequisitionApproval {
  status: string;
  approvalDate?: number;
  approver?: { firstName: string; lastName: string };
  approvalComment?: string;
}

export interface RequisitionUserBudgets {
  budget: Price;
  budgetPeriod: string;
  orderSpentLimit: Price;
  remainingBudget?: Price;
  spentBudget?: Price;
  spentBudgetIncludingThisOrder?: Price;
}

interface AbstractRequisition {
  requisitionNo: string;
  orderNo?: string;
  creationDate: number;
  lineItemCount: number;

  user: User;
  userBudgets: RequisitionUserBudgets;
  approval: RequisitionApproval;
}

export interface Requisition extends Basket, AbstractRequisition {}

export interface RequisitionView extends BasketView, AbstractRequisition {}

export const createRequisitionView = memoize(
  (requisition, products, categoryTree): RequisitionView => {
    if (!requisition) {
      return;
    }

    return {
      ...requisition,
      lineItems: requisition.lineItems
        ? requisition.lineItems.map(li => ({
            ...li,
            product: products ? createProductView(products[li.productSKU], categoryTree) : undefined,
          }))
        : [],
    };
  },
  // fire when requisition or line items changed
  (requisition: Requisition, products: Dictionary<Product | VariationProduct | VariationProductMaster>): string =>
    requisition && JSON.stringify([requisition, ...requisition.lineItems.map(li => products[li.productSKU])])
);
