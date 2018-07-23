import { QuoteRequestData } from './quote-request.interface';
import { QuoteRequest, QuoteRequestStateType } from './quote-request.model';

export class QuoteRequestHelper {
  static getQuoteRequestState(quoteRequest: QuoteRequest | QuoteRequestData): QuoteRequestStateType {
    if (quoteRequest.submitted) {
      return 'Submitted';
    }

    return 'New';
  }
}
