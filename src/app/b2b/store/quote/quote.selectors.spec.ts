import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { combineReducers, select, Store, StoreModule } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Quote } from '../../../models/quote/quote.model';
import { QuoteRequest } from '../../../models/quoterequest/quoterequest.model';
import { shoppingReducers } from '../../../shopping/store/shopping.system';
import { c } from '../../../utils/dev/marbles-utils';
import { B2bState } from '../b2b.state';
import { b2bReducers } from '../b2b.system';
import { LoadQuotes, LoadQuotesFail, LoadQuotesSuccess } from './quote.actions';
import { getCurrentQuotes, getQuoteError, getQuoteLoading } from './quote.selectors';

describe('Quote Selectors', () => {
  let store$: Store<B2bState>;

  let quotes$: Observable<(Quote | QuoteRequest)[]>;
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
    quotes$ = store$.pipe(select(getCurrentQuotes));
    quoteLoading$ = store$.pipe(select(getQuoteLoading));
    quoteError$ = store$.pipe(select(getQuoteError));
  });

  describe('with empty state', () => {
    it('should be present if no quotes or quoteRequest are present', () => {
      expect(quotes$).toBeObservable(c([]));
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
    });

    it('should set loading to false and set error state', () => {
      store$.dispatch(new LoadQuotesFail({ message: 'invalid' } as HttpErrorResponse));
      expect(quoteLoading$).toBeObservable(c(false));
      expect(quotes$).toBeObservable(c([]));
      expect(quoteError$).toBeObservable(c({ message: 'invalid' }));
    });
  });
});
