import { Quote, QuoteRequest, QuoteStub, QuotingEntity } from './quoting.model';

export class QuotingHelper {
  static isStub(entity: QuotingEntity): entity is QuoteStub {
    return !entity.completenessLevel || entity.completenessLevel === 'Stub';
  }

  static isNotStub(entity: QuotingEntity): entity is Quote | QuoteRequest {
    return !QuotingHelper.isStub(entity);
  }

  /**
   * sorts entity stubs to the bottom and all other quotes and quote requests descending by number
   */
  static sort(a: QuotingEntity, b: QuotingEntity): number {
    if (QuotingHelper.isStub(a) !== QuotingHelper.isStub(b)) {
      return QuotingHelper.isStub(a) ? 1 : -1;
    } else if (QuotingHelper.isNotStub(a) && QuotingHelper.isNotStub(b)) {
      return b.number.localeCompare(a.number);
    }
    return 0;
  }
}
