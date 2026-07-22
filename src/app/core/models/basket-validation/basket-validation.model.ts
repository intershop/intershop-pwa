import { BasketFeedbackView } from 'ish-core/models/basket-feedback/basket-feedback.model';
import { Basket } from 'ish-core/models/basket/basket.model';

export type BasketValidationScopeType =
  | ''
  | 'Addresses'
  | 'All'
  | 'CostCenter'
  | 'InvoiceAddress'
  | 'Payment'
  | 'Products'
  | 'Promotion'
  | 'Quote'
  | 'Shipping'
  | 'ShippingAddress'
  | 'Subscription'
  /* no scope: a minimum is validated */
  | 'Value'; // min max order values

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
