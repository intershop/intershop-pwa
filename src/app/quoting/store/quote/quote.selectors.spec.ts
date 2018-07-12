import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { combineReducers, select, Store, StoreModule } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Product } from '../../../models/product/product.model';
import { QuoteData } from '../../../models/quote/quote.interface';
import { Quote } from '../../../models/quote/quote.model';
import { LoadProductSuccess } from '../../../shopping/store/products';
import { shoppingReducers } from '../../../shopping/store/shopping.system';
import { c } from '../../../utils/dev/marbles-utils';
import { QuotingState } from '../quoting.state';
import { quotingReducers } from '../quoting.system';
import { LoadQuotes, LoadQuotesFail, LoadQuotesSuccess, SelectQuote } from './quote.actions';
import {
  getCurrentQuotes,
  getQuoteError,
  getQuoteLoading,
  getSelectedQuote,
  getSelectedQuoteId,
} from './quote.selectors';

describe('Quote Selectors', () => {
  let store$: Store<QuotingState>;

  let getSelectedQuoteId$: Observable<string>;
  let getSelectedQuote$: Observable<Quote>;
  let quotes$: Observable<(Quote)[]>;
  let quoteLoading$: Observable<boolean>;
  let quoteError$: Observable<HttpErrorResponse>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          quoting: combineReducers(quotingReducers),
          shopping: combineReducers(shoppingReducers),
        }),
      ],
    });

    store$ = TestBed.get(Store);
    getSelectedQuoteId$ = store$.pipe(select(getSelectedQuoteId));
    getSelectedQuote$ = store$.pipe(select(getSelectedQuote));
    quotes$ = store$.pipe(select(getCurrentQuotes));
    quoteLoading$ = store$.pipe(select(getQuoteLoading));
    quoteError$ = store$.pipe(select(getQuoteError));
  });

  describe('with empty state', () => {
    it('should be present if no quotes are present', () => {
      expect(quotes$).toBeObservable(c([]));
    });
  });

  describe('selecting a quote', () => {
    beforeEach(() => {
      store$.dispatch(
        new LoadQuotesSuccess([
          { id: 'test', items: [{ productSKU: 'test' }] },
          { id: 'test2', items: [] },
        ] as QuoteData[])
      );
      store$.dispatch(new LoadProductSuccess({ sku: 'test' } as Product));
      store$.dispatch(new SelectQuote('test'));
    });

    it('should set "selected" to selected quote item id and set selected quote', () => {
      const expected = {
        id: 'test',
        state: 'Responded',
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

  describe('loading quote list', () => {
    beforeEach(() => {
      store$.dispatch(new LoadQuotes());
    });

    it('should set the state to loading', () => {
      expect(quoteLoading$).toBeObservable(c(true));
    });

    it('should set loading to false and set quote state', () => {
      const quotes = [{ id: 'test' }] as QuoteData[];
      store$.dispatch(new LoadQuotesSuccess(quotes));

      expect(quoteLoading$).toBeObservable(c(false));
      expect(quotes$).toBeObservable(c([{ id: 'test', state: 'Responded' } as Quote]));
    });

    it('should set loading to false and set error state', () => {
      store$.dispatch(new LoadQuotesFail({ message: 'invalid' } as HttpErrorResponse));
      expect(quoteLoading$).toBeObservable(c(false));
      expect(quotes$).toBeObservable(c([]));
      expect(quoteError$).toBeObservable(c({ message: 'invalid' }));
    });
  });
});
