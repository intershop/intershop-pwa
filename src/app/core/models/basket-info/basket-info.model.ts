import { BasketFeedback } from 'ish-core/models/basket-feedback/basket-feedback.model';

export interface BasketInfo {
  causes?: BasketFeedback[];
  code: string;
  message: string;
}
