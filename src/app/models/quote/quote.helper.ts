import { QuoteData } from './quote.interface';
import { Quote, QuoteStateType } from './quote.model';

export class QuoteHelper {
  static getQuoteState(quote: Quote | QuoteData): QuoteStateType {
    if (quote.rejected) {
      return 'Rejected';
    }

    // TODO: Converted state

    // TODO: Expired state

    return 'Responded';
  }
}
