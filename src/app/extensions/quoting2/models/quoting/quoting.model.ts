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
  quantity: number;

  singlePrice: Price;
  totalPrice: Price;
}

interface QuoteItem extends QuoteRequestItem {
  originQuantity: number;

  originSinglePrice: Price;
  originTotalPrice: Price;
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

  validFromDate: number;
  validToDate: number;
  sellerComment: string;
  originTotal: Price;
}

export interface QuoteRequest extends QuoteBase<QuoteRequestItem | QuoteItemStub> {
  type: 'QuoteRequest';

  submittedDate?: number;
}
