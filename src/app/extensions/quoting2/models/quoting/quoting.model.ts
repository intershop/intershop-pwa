import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { Price } from 'ish-core/models/price/price.model';

export type QuoteCompletenessLevel = 'Stub' | 'List' | 'Detail';

export interface QuoteStub {
  type: 'Quote' | 'QuoteRequest';
  id: string;
  completenessLevel: QuoteCompletenessLevel;
}

interface QuoteItemStub {
  id: string;
}

interface QuoteRequestItem extends QuoteItemStub {
  productSKU: string;
  quantity: Attribute<number>;

  singleBasePrice: Price;
  totals: { total: Price };
}

interface QuoteItem extends QuoteRequestItem {
  originQuantity: Attribute<number>;

  originSingleBasePrice: Price;
  totals: {
    total: Price;
    originTotal: Price;
  };
}

interface QuoteBase<ItemType> extends QuoteStub {
  number: string;
  displayName: string;
  description: string;

  creationDate: number;

  total: Price;

  items: ItemType[];
}

export interface Quote extends QuoteBase<QuoteItem> {
  type: 'Quote';

  rejected: boolean;
  validFromDate: number;
  validToDate: number;
  sellerComment: string;
  originTotal: Price;
}

export interface QuoteRequest extends QuoteBase<QuoteRequestItem | QuoteItemStub> {
  type: 'QuoteRequest';

  submittedDate?: number;
  editable: boolean;
}

export type QuotingEntity = QuoteStub | Quote | QuoteRequest;

export type QuoteStatus = 'Rejected' | 'Expired' | 'Responded' | 'Submitted' | 'New' | 'Unknown';
