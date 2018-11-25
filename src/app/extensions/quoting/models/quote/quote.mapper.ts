import { QuoteHelper } from './quote.helper';
import { QuoteData } from './quote.interface';
import { Quote } from './quote.model';

export class QuoteMapper {
  static fromData(data: QuoteData): Quote {
    return {
      ...data,
      state: QuoteHelper.getQuoteState(data),
    } as Quote;
  }
}
