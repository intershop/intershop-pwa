import { Action } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { Link } from 'ish-core/models/link/link.model';

import { QuoteLineItemResult } from '../../models/quote-line-item-result/quote-line-item-result.model';
import { QuoteData } from '../../models/quote/quote.interface';

export enum QuoteActionTypes {
  SelectQuote = '[Quote] Select Quote',
  LoadQuotes = '[Quote Internal] Load Quotes',
  LoadQuotesFail = '[Quote API] Load Quotes Fail',
  LoadQuotesSuccess = '[Quote API] Load Quotes Success',
  DeleteQuote = '[Quote] Delete Quote',
  DeleteQuoteFail = '[Quote API] Delete Quote Fail',
  DeleteQuoteSuccess = '[Quote API] Delete Quote Success',
  RejectQuote = '[Quote] Reject Quote',
  RejectQuoteFail = '[Quote API] Reject Quote Fail',
  RejectQuoteSuccess = '[Quote API] Reject Quote Success',
  CreateQuoteRequestFromQuote = '[Quote] Create Quote Request from Quote',
  CreateQuoteRequestFromQuoteFail = '[Quote API] Create Quote Request from Quote Fail',
  CreateQuoteRequestFromQuoteSuccess = '[Quote API] Create Quote Request from Quote Success',
  AddQuoteToBasket = '[Basket] Add Quote To Basket',
  AddQuoteToBasketFail = '[Basket API] Add Quote To Basket Fail',
  AddQuoteToBasketSuccess = '[Basket API] Add Quote To Basket Success',
}

export class SelectQuote implements Action {
  readonly type = QuoteActionTypes.SelectQuote;
  constructor(public payload: { id: string }) {}
}

export class LoadQuotes implements Action {
  readonly type = QuoteActionTypes.LoadQuotes;
}

export class LoadQuotesFail implements Action {
  readonly type = QuoteActionTypes.LoadQuotesFail;
  constructor(public payload: { error: HttpError }) {}
}

export class LoadQuotesSuccess implements Action {
  readonly type = QuoteActionTypes.LoadQuotesSuccess;
  constructor(public payload: { quotes: QuoteData[] }) {}
}

export class DeleteQuote implements Action {
  readonly type = QuoteActionTypes.DeleteQuote;
  constructor(public payload: { id: string }) {}
}

export class DeleteQuoteFail implements Action {
  readonly type = QuoteActionTypes.DeleteQuoteFail;
  constructor(public payload: { error: HttpError }) {}
}

export class DeleteQuoteSuccess implements Action {
  readonly type = QuoteActionTypes.DeleteQuoteSuccess;
  constructor(public payload: { id: string }) {}
}

export class RejectQuote implements Action {
  readonly type = QuoteActionTypes.RejectQuote;
}

export class RejectQuoteFail implements Action {
  readonly type = QuoteActionTypes.RejectQuoteFail;
  constructor(public payload: { error: HttpError }) {}
}

export class RejectQuoteSuccess implements Action {
  readonly type = QuoteActionTypes.RejectQuoteSuccess;
  constructor(public payload: { id: string }) {}
}

export class CreateQuoteRequestFromQuote implements Action {
  readonly type = QuoteActionTypes.CreateQuoteRequestFromQuote;
}

export class CreateQuoteRequestFromQuoteFail implements Action {
  readonly type = QuoteActionTypes.CreateQuoteRequestFromQuoteFail;
  constructor(public payload: { error: HttpError }) {}
}

export class CreateQuoteRequestFromQuoteSuccess implements Action {
  readonly type = QuoteActionTypes.CreateQuoteRequestFromQuoteSuccess;
  constructor(public payload: { quoteLineItemRequest: QuoteLineItemResult }) {}
}

export class AddQuoteToBasket implements Action {
  readonly type = QuoteActionTypes.AddQuoteToBasket;
  constructor(public payload: { quoteId: string; basketId?: string }) {}
}

export class AddQuoteToBasketFail implements Action {
  readonly type = QuoteActionTypes.AddQuoteToBasketFail;
  constructor(public payload: { error: HttpError }) {}
}

export class AddQuoteToBasketSuccess implements Action {
  readonly type = QuoteActionTypes.AddQuoteToBasketSuccess;
  constructor(public payload: { link: Link }) {}
}

export type QuoteAction =
  | SelectQuote
  | LoadQuotes
  | LoadQuotesFail
  | LoadQuotesSuccess
  | DeleteQuote
  | DeleteQuoteFail
  | DeleteQuoteSuccess
  | RejectQuote
  | RejectQuoteFail
  | RejectQuoteSuccess
  | CreateQuoteRequestFromQuote
  | CreateQuoteRequestFromQuoteFail
  | CreateQuoteRequestFromQuoteSuccess
  | AddQuoteToBasket
  | AddQuoteToBasketFail
  | AddQuoteToBasketSuccess;
