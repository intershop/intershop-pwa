import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { Link } from 'ish-core/models/link/link.model';
import { PriceData } from 'ish-core/models/price/price.interface';

// tslint:disable: project-structure

interface QuoteBaseData<ItemType> {
  id: string;
  number: string;
  displayName: string;
  description?: string;

  creationDate: number;
  total: PriceData;

  items: ItemType[];
}

interface LineItemBaseData {
  quantity: Attribute<number>;
  productSKU: string;

  singlePrice: PriceData;
  totalPrice: PriceData;
}

interface QuoteLineItemResponse extends LineItemBaseData {
  type: 'QuoteLineItem';

  originQuantity: Attribute<number>;

  originSinglePrice: PriceData;
  originTotalPrice: PriceData;
}

export interface QuoteResponse extends QuoteBaseData<QuoteLineItemResponse> {
  type: 'Quote';

  rejected?: boolean;
  sellerComment: string;

  validFromDate: number;
  validToDate: number;

  originTotal: PriceData;
}

export interface QuoteRequestLineItemResponse extends LineItemBaseData {
  type: 'QuoteRequestLineItem';
  id: string;
}

export interface QuoteRequestResponse extends QuoteBaseData<Link | QuoteRequestLineItemResponse> {
  type: 'QuoteRequest';

  submittedDate?: number;
}

export type QuoteData = Link | QuoteResponse | QuoteRequestResponse;
