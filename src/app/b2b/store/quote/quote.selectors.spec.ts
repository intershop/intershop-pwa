import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { combineReducers, select, Store, StoreModule } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Product } from '../../../models/product/product.model';
import { QuoteRequestItem } from '../../../models/quote-request-item/quote-request-item.model';
import { Quote } from '../../../models/quote/quote.model';
import { LoadProductSuccess } from '../../../shopping/store/products';
import { shoppingReducers } from '../../../shopping/store/shopping.system';
import { c } from '../../../utils/dev/marbles-utils';
import { B2bState } from '../b2b.state';
import { b2bReducers } from '../b2b.system';
import {
  LoadQuoteRequestItems,
  LoadQuoteRequestItemsFail,
  LoadQuoteRequestItemsSuccess,
  LoadQuoteRequests,
  LoadQuoteRequestsFail,
  LoadQuoteRequestsSuccess,
  LoadQuotes,
  LoadQuotesFail,
  LoadQuotesSuccess,
  SelectQuote,
} from './quote.actions';
import {
  getActiveQuoteRequest,
  getCurrentQuotes,
  getQuoteError,
  getQuoteLoading,
  getQuoteRequstItems,
  getSelectedQuote,
  getSelectedQuoteId,
} from './quote.selectors';

describe('Quote Selectors', () => {
  let store$: Store<B2bState>;

  let getSelectedQuoteId$: Observable<string>;
  let getSelectedQuote$: Observable<Quote>;
  let quotes$: Observable<Quote[]>;
  let quoteRequstItems$: Observable<QuoteRequestItem[]>;
  let activeQuoteRequest$: Observable<Quote>;
  let quoteLoading$: Observable<boolean>;
  let quoteError$: Observable<HttpErrorResponse>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          b2b: combineReducers(b2bReducers),
          shopping: combineReducers(shoppingReducers),
        }),
      ],
    });

    store$ = TestBed.get(Store);
    getSelectedQuoteId$ = store$.pipe(select(getSelectedQuoteId));
    getSelectedQuote$ = store$.pipe(select(getSelectedQuote));
    quotes$ = store$.pipe(select(getCurrentQuotes));
    quoteRequstItems$ = store$.pipe(select(getQuoteRequstItems));
    activeQuoteRequest$ = store$.pipe(select(getActiveQuoteRequest));
    quoteLoading$ = store$.pipe(select(getQuoteLoading));
    quoteError$ = store$.pipe(select(getQuoteError));
  });

  describe('with empty state', () => {
    it('should be present if no quotes or quoteRequest are present', () => {
      expect(quotes$).toBeObservable(c([]));
    });
  });

  describe('selecting a quote', () => {
    beforeEach(() => {
      store$.dispatch(
        new LoadQuoteRequestsSuccess([{ id: 'test', items: [] }, { id: 'test2', editable: true, items: [] }] as Quote[])
      );
      store$.dispatch(new LoadProductSuccess({ sku: 'test' } as Product));
      store$.dispatch(new LoadQuoteRequestItemsSuccess([{ productSKU: 'test' }] as QuoteRequestItem[]));
      store$.dispatch(new SelectQuote('test'));
    });

    it('should set "selected" to selected quote item id and set selected quote', () => {
      const expected = {
        id: 'test',
        items: [
          {
            productSKU: 'test',
            product: { sku: 'test' } as Product,
          },
        ],
      };

      expect(getSelectedQuoteId$).toBeObservable(c('test'));
      expect(getSelectedQuote$).toBeObservable(c(expected));
    });
  });

  describe('loading quote request list', () => {
    beforeEach(() => {
      store$.dispatch(new LoadQuoteRequests());
    });

    it('should set the state to loading', () => {
      expect(quoteLoading$).toBeObservable(c(true));
    });

    it('should set loading to false and set quote state', () => {
      const quoteRequests = [{ id: 'test', items: [] }, { id: 'test2', editable: true, items: [] }] as Quote[];
      store$.dispatch(new LoadQuoteRequestsSuccess(quoteRequests));

      expect(quoteLoading$).toBeObservable(c(false));
      expect(quotes$).toBeObservable(c(quoteRequests));
      expect(activeQuoteRequest$).toBeObservable(c(quoteRequests[1]));
    });

    it('should set loading to false and set error state', () => {
      store$.dispatch(new LoadQuoteRequestsFail({ message: 'invalid' } as HttpErrorResponse));
      expect(quoteLoading$).toBeObservable(c(false));
      expect(quotes$).toBeObservable(c([]));
      expect(quoteError$).toBeObservable(c({ message: 'invalid' }));
    });
  });

  describe('loading quote list', () => {
    beforeEach(() => {
      store$.dispatch(new LoadQuotes());
    });

    it('should set the state to loading', () => {
      expect(quoteLoading$).toBeObservable(c(true));
    });

    it('should set loading to false and set quote state', () => {
      const quotes = [{ id: 'test' }] as Quote[];
      store$.dispatch(new LoadQuotesSuccess(quotes));

      expect(quoteLoading$).toBeObservable(c(false));
      expect(quotes$).toBeObservable(c(quotes));
      expect(activeQuoteRequest$).toBeObservable(c(null));
    });

    it('should set loading to false and set error state', () => {
      store$.dispatch(new LoadQuotesFail({ message: 'invalid' } as HttpErrorResponse));
      expect(quoteLoading$).toBeObservable(c(false));
      expect(quotes$).toBeObservable(c([]));
      expect(quoteError$).toBeObservable(c({ message: 'invalid' }));
    });
  });

  describe('loading quote request item list', () => {
    beforeEach(() => {
      store$.dispatch(new LoadQuoteRequestItems('test'));
    });

    it('should set the state to loading', () => {
      expect(quoteLoading$).toBeObservable(c(true));
    });

    it('should set loading to false and set quote state', () => {
      const quoteRequestItems = [{ productSKU: 'test' }] as QuoteRequestItem[];
      store$.dispatch(new LoadQuoteRequestItemsSuccess(quoteRequestItems));

      expect(quoteLoading$).toBeObservable(c(false));
      expect(quoteRequstItems$).toBeObservable(c(quoteRequestItems));
      expect(activeQuoteRequest$).toBeObservable(c(null));
    });

    it('should set loading to false and set error state', () => {
      store$.dispatch(new LoadQuoteRequestItemsFail({ message: 'invalid' } as HttpErrorResponse));
      expect(quoteLoading$).toBeObservable(c(false));
      expect(quoteRequstItems$).toBeObservable(c([]));
      expect(quoteError$).toBeObservable(c({ message: 'invalid' }));
    });
  });
});
