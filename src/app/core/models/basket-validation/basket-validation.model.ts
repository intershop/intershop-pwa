import { Basket } from 'ish-core/models/basket/basket.model';

export interface BasketValidationErrorType {
  code: string;
  message: string;
  parameters?: {
    lineItemId?: string;
    shippingRestriction?: string;
  };
}

export interface BasketValidationResultType {
  valid: boolean;
  adjusted: boolean;
  errors?: BasketValidationErrorType[];
}

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

export interface BasketValidation {
  basket: Basket;
  results: BasketValidationResultType;
}
