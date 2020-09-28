import { Quote, QuoteRequest, QuoteStatus, QuoteStub, QuotingEntity } from './quoting.model';

export class QuotingHelper {
  static isStub(entity: QuotingEntity): entity is QuoteStub {
    return !entity?.completenessLevel || entity.completenessLevel === 'Stub';
  }

  static isNotStub(entity: QuotingEntity): entity is Quote | QuoteRequest {
    return !QuotingHelper.isStub(entity);
  }

  private static isQuote(entity: QuotingEntity): entity is Quote {
    return QuotingHelper.isNotStub(entity) && entity.type === 'Quote';
  }

  /**
   * sorts entity stubs to the bottom and all other quotes and quote requests descending by creationDate
   */
  static sort(a: QuotingEntity, b: QuotingEntity): number {
    if (QuotingHelper.isStub(a) !== QuotingHelper.isStub(b)) {
      return QuotingHelper.isStub(a) ? 1 : -1;
    } else if (QuotingHelper.isNotStub(a) && QuotingHelper.isNotStub(b)) {
      return b.creationDate - a.creationDate;
    }
    return 0;
  }

  static state(entity: QuotingEntity): QuoteStatus {
    if (QuotingHelper.isNotStub(entity)) {
      if (QuotingHelper.isQuote(entity)) {
        return entity.rejected ? 'Rejected' : entity.validToDate < new Date().getTime() ? 'Expired' : 'Responded';
      } else {
        return entity.submittedDate ? 'Submitted' : 'New';
      }
    }
    return 'Unknown';
  }

  static itemCount(entity: { items?: unknown[]; itemCount?: number }): number {
    return entity.items?.length ?? entity?.itemCount;
  }

  static asQuote(entity: QuotingEntity): Quote {
    return entity as Quote;
  }

  static asQuoteRequest(entity: QuotingEntity): QuoteRequest {
    return entity as QuoteRequest;
  }
}
