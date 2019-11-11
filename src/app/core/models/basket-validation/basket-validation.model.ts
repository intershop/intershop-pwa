import { BasketFeedback } from 'ish-core/models/basket-feedback/basket-feedback.model';
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

export interface BasketValidationResultType {
  valid: boolean;
  adjusted: boolean;
  errors?: BasketFeedback[];
  infos?: BasketFeedback[];
}

export interface BasketValidation {
  basket: Basket;
  results: BasketValidationResultType;
}
