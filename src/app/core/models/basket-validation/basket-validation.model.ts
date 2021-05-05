import { BasketFeedbackView } from 'ish-core/models/basket-feedback/basket-feedback.model';
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
  | 'CostCenter'
  | 'All'
  /* no scope: a minimum is validated */
  | '';

export interface BasketValidationResultType {
  valid: boolean;
  adjusted: boolean;
  errors?: BasketFeedbackView[];
  infos?: BasketFeedbackView[];
}

export interface BasketValidation {
  basket: Basket;
  results: BasketValidationResultType;
  scopes?: BasketValidationScopeType[];
}
