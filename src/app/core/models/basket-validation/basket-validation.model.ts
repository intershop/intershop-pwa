import { Basket } from 'ish-core/models/basket/basket.model';

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
    shippingRestriction?: string;
    scopes?: BasketValidationScopeType[];
  };
}

export interface BasketValidationResultType {
  valid: boolean;
  adjusted: boolean;
  errors?: BasketValidationErrorType[];
}

export interface BasketValidation {
  basket: Basket;
  results: BasketValidationResultType;
}
