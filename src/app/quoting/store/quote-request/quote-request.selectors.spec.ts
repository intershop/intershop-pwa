import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { combineReducers, select, Store, StoreModule } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Product } from '../../../models/product/product.model';
import { QuoteRequestItem } from '../../../models/quote-request-item/quote-request-item.model';
import { QuoteRequest } from '../../../models/quoterequest/quoterequest.model';
import { LoadProductSuccess } from '../../../shopping/store/products';
import { shoppingReducers } from '../../../shopping/store/shopping.system';
import { c } from '../../../utils/dev/marbles-utils';
import { QuotingState } from '../quoting.state';
import { quotingReducers } from '../quoting.system';
import {
  LoadQuoteRequestItems,
  LoadQuoteRequestItemsFail,
  LoadQuoteRequestItemsSuccess,
  LoadQuoteRequests,
  LoadQuoteRequestsFail,
  LoadQuoteRequestsSuccess,
  SelectQuoteRequest,
} from './quote-request.actions';
import {
  getActiveQuoteRequest,
  getCurrentQuoteRequests,
  getQuoteRequestError,
  getQuoteRequestLoading,
  getQuoteRequstItems,
  getSelectedQuoteRequest,
  getSelectedQuoteRequestId,
} from './quote-request.selectors';

describe('Quote Request Selectors', () => {
  let store$: Store<QuotingState>;

  let getSelectedQuoteRequestId$: Observable<string>;
  let getSelectedQuoteRequest$: Observable<QuoteRequest>;
  let quoteRequests$: Observable<QuoteRequest[]>;
  let quoteRequstItems$: Observable<QuoteRequestItem[]>;
  let activeQuoteRequest$: Observable<QuoteRequest>;
  let quoteRequestLoading$: Observable<boolean>;
  let quoteRequestError$: Observable<HttpErrorResponse>;

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
    getSelectedQuoteRequestId$ = store$.pipe(select(getSelectedQuoteRequestId));
    getSelectedQuoteRequest$ = store$.pipe(select(getSelectedQuoteRequest));
    quoteRequests$ = store$.pipe(select(getCurrentQuoteRequests));
    quoteRequstItems$ = store$.pipe(select(getQuoteRequstItems));
    activeQuoteRequest$ = store$.pipe(select(getActiveQuoteRequest));
    quoteRequestLoading$ = store$.pipe(select(getQuoteRequestLoading));
    quoteRequestError$ = store$.pipe(select(getQuoteRequestError));
  });

  describe('with empty state', () => {
    it('should be present if no quoteRequest are present', () => {
      expect(quoteRequests$).toBeObservable(c([]));
    });
  });

  describe('selecting a quote request', () => {
    beforeEach(() => {
      store$.dispatch(
        new LoadQuoteRequestsSuccess([
          { id: 'test', items: [] },
          { id: 'test2', editable: true, items: [] },
        ] as QuoteRequest[])
      );
      store$.dispatch(new LoadProductSuccess({ sku: 'test' } as Product));
      store$.dispatch(new LoadQuoteRequestItemsSuccess([{ productSKU: 'test' }] as QuoteRequestItem[]));
      store$.dispatch(new SelectQuoteRequest('test'));
    });

    it('should set "selected" to selected quote item id and set selected quote request', () => {
      const expected = {
        id: 'test',
        items: [
          {
            productSKU: 'test',
            product: { sku: 'test' } as Product,
          },
        ],
      };

      expect(getSelectedQuoteRequestId$).toBeObservable(c('test'));
      expect(getSelectedQuoteRequest$).toBeObservable(c(expected));
    });
  });

  describe('loading quote request list', () => {
    beforeEach(() => {
      store$.dispatch(new LoadQuoteRequests());
    });

    it('should set the state to loading', () => {
      expect(quoteRequestLoading$).toBeObservable(c(true));
    });

    it('should set loading to false and set quote state', () => {
      const quoteRequests = [{ id: 'test', items: [] }, { id: 'test2', editable: true, items: [] }] as QuoteRequest[];
      store$.dispatch(new LoadQuoteRequestsSuccess(quoteRequests));

      expect(quoteRequestLoading$).toBeObservable(c(false));
      expect(activeQuoteRequest$).toBeObservable(c(quoteRequests[1]));
    });

    it('should set loading to false and set error state', () => {
      store$.dispatch(new LoadQuoteRequestsFail({ message: 'invalid' } as HttpErrorResponse));
      expect(quoteRequestLoading$).toBeObservable(c(false));
      expect(quoteRequestError$).toBeObservable(c({ message: 'invalid' }));
    });
  });

  describe('loading quote request item list', () => {
    beforeEach(() => {
      store$.dispatch(new LoadQuoteRequestItems('test'));
    });

    it('should set the state to loading', () => {
      expect(quoteRequestLoading$).toBeObservable(c(true));
    });

    it('should set loading to false and set quote state', () => {
      const quoteRequestItems = [{ productSKU: 'test' }] as QuoteRequestItem[];
      store$.dispatch(new LoadQuoteRequestItemsSuccess(quoteRequestItems));

      expect(quoteRequestLoading$).toBeObservable(c(false));
      expect(quoteRequstItems$).toBeObservable(c(quoteRequestItems));
      expect(activeQuoteRequest$).toBeObservable(c(null));
    });

    it('should set loading to false and set error state', () => {
      store$.dispatch(new LoadQuoteRequestItemsFail({ message: 'invalid' } as HttpErrorResponse));
      expect(quoteRequestLoading$).toBeObservable(c(false));
      expect(quoteRequstItems$).toBeObservable(c([]));
      expect(quoteRequestError$).toBeObservable(c({ message: 'invalid' }));
    });
  });
});
