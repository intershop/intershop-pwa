import { BasketFeedback } from 'ish-core/models/basket-feedback/basket-feedback.model';
import { ErrorFeedback } from 'ish-core/models/http-error/http-error.model';

export interface BasketInfo {
  causes?: BasketFeedback[];
  code: string;
  message: string;
  error?: ErrorFeedback[];
}
