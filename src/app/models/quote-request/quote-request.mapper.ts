import { QuoteRequestHelper } from './quote-request.helper';
import { QuoteRequestData } from './quote-request.interface';
import { QuoteRequest } from './quote-request.model';

export class QuoteRequestMapper {
  static fromData(data: QuoteRequestData): QuoteRequest {
    return {
      ...data,
      state: QuoteRequestHelper.getQuoteRequestState(data),
    } as QuoteRequest;
  }
}
