import { BasketValidationScopeType } from 'ish-core/models/basket-validation/basket-validation.model';
import { Product } from 'ish-core/models/product/product.model';

export interface BasketFeedback {
  code: string;
  message: string;
  parameters?: {
    lineItemId?: string;
    productSku?: string;
    product?: Product;
    shippingRestriction?: string;
    scopes?: BasketValidationScopeType[];
  };
}
