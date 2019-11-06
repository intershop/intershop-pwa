import { Basket } from 'ish-core/models/basket/basket.model';
import { Product } from 'ish-core/models/product/product.model';

export type BasketValidationScopeType =
  | 'Products'
  | 'Value' // min max order values
  | 'Addresses'
  | 'InvoiceAddress'
  | 'ShippingAddress'
  | 'Shipping'
  | 'Payment'
  | 'Promotion'
  | 'All'
  | ''; // no scope: a minimum is validated

export interface BasketValidationErrorType {
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

export interface BasketValidationResultType {
  valid: boolean;
  adjusted: boolean;
  errors?: BasketValidationErrorType[];
  infos?: BasketValidationErrorType[];
}

export interface BasketValidation {
  basket: Basket;
  results: BasketValidationResultType;
}
