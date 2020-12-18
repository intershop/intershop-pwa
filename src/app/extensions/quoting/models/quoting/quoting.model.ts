import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { Price } from 'ish-core/models/price/price.model';

export type QuoteCompletenessLevel = 'Stub' | 'List' | 'Detail';

export interface QuoteStub {
  type: 'Quote' | 'QuoteRequest';
  id: string;
  completenessLevel: QuoteCompletenessLevel;
}

export interface QuoteStubFromAttributes extends QuoteStub {
  completenessLevel: 'List';
  number: string;
  displayName: string;
  itemCount: number;
  creationDate: number;
  validFromDate: number;
  validToDate: number;
  submittedDate: number;
  rejected: boolean;
}

interface QuoteItemStub {
  id: string;
}

export interface QuoteRequestItem extends QuoteItemStub {
  productSKU: string;
  quantity: Attribute<number>;

  singleBasePrice: Price;
  total: Price;
}

export interface QuoteItem extends QuoteRequestItem {
  originQuantity: Attribute<number>;

  originSingleBasePrice: Price;
  total: Price;
  originTotal: Price;
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
}

export type QuotingEntity = QuoteStub | Quote | QuoteRequest | QuoteStubFromAttributes;

export type QuoteStatus = 'Rejected' | 'Expired' | 'Responded' | 'Submitted' | 'New' | 'Unknown';
