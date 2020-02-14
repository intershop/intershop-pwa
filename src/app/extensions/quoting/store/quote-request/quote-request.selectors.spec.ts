import { TestBed } from '@angular/core/testing';
import { combineReducers } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { Product } from 'ish-core/models/product/product.model';
import { LoadProductSuccess } from 'ish-core/store/shopping/products';
import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { TestStore, ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { QuoteRequestItem } from '../../models/quote-request-item/quote-request-item.model';
import { QuoteRequestData } from '../../models/quote-request/quote-request.interface';
import { quotingReducers } from '../quoting-store.module';

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
  getActiveQuoteRequestWithProducts,
  getCurrentQuoteRequests,
  getQuoteRequestError,
  getQuoteRequestItemsWithProducts,
  getQuoteRequestLoading,
  getSelectedQuoteRequestId,
  getSelectedQuoteRequestWithProducts,
} from './quote-request.selectors';

describe('Quote Request Selectors', () => {
  let store$: TestStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: ngrxTesting({
        reducers: {
          quoting: combineReducers(quotingReducers),
          shopping: combineReducers(shoppingReducers),
        },
      }),
    });

    store$ = TestBed.get(TestStore);
  });

  describe('with empty state', () => {
    it('should be present if no quoteRequest are present', () => {
      expect(getCurrentQuoteRequests(store$.state)).toBeEmpty();
    });
  });

  describe('selecting a quote request', () => {
    beforeEach(() => {
      store$.dispatch(
        new LoadQuoteRequestsSuccess({
          quoteRequests: [{ id: 'test', items: [] }, { id: 'test2', editable: true, items: [] }] as QuoteRequestData[],
        })
      );
      store$.dispatch(new LoadProductSuccess({ product: { sku: 'test' } as Product }));
      store$.dispatch(
        new LoadQuoteRequestItemsSuccess({ quoteRequestItems: [{ productSKU: 'test' }] as QuoteRequestItem[] })
      );
      store$.dispatch(new SelectQuoteRequest({ id: 'test' }));
    });

    it('should set "selected" to selected quote item id and set selected quote request', () => {
      expect(getSelectedQuoteRequestId(store$.state)).toEqual('test');
      expect(getSelectedQuoteRequestWithProducts(store$.state)).toMatchInlineSnapshot(`
        Object {
          "id": "test",
          "items": Array [
            Object {
              "product": Object {
                "attributes": Array [],
                "defaultCategory": [Function],
                "sku": "test",
              },
              "productSKU": "test",
            },
          ],
          "state": "New",
        }
      `);
    });
  });

  describe('loading quote request list', () => {
    beforeEach(() => {
      store$.dispatch(new LoadQuoteRequests());
    });

    it('should set the state to loading', () => {
      expect(getQuoteRequestLoading(store$.state)).toBeTrue();
    });

    it('should set loading to false and set quote state', () => {
      const quoteRequests = [
        { id: 'test', items: [] },
        { id: 'test2', editable: true, items: [], state: 'New' },
      ] as QuoteRequestData[];
      store$.dispatch(new LoadQuoteRequestsSuccess({ quoteRequests }));

      expect(getQuoteRequestLoading(store$.state)).toBeFalse();
      expect(getActiveQuoteRequest(store$.state)).toEqual(quoteRequests[1]);
    });

    it('should set loading to false and set error state', () => {
      store$.dispatch(new LoadQuoteRequestsFail({ error: { message: 'invalid' } as HttpError }));
      expect(getQuoteRequestLoading(store$.state)).toBeFalse();
      expect(getQuoteRequestError(store$.state)).toEqual({ message: 'invalid' });
    });
  });

  describe('loading quote request item list', () => {
    beforeEach(() => {
      store$.dispatch(new LoadQuoteRequestItems({ id: 'test' }));
    });

    it('should set the state to loading', () => {
      expect(getQuoteRequestLoading(store$.state)).toBeTrue();
    });

    it('should set loading to false and set quote state', () => {
      const quoteRequestItems = [{ productSKU: 'test' }] as QuoteRequestItem[];
      store$.dispatch(new LoadQuoteRequestItemsSuccess({ quoteRequestItems }));

      expect(getQuoteRequestLoading(store$.state)).toBeFalse();
      expect(getQuoteRequestItemsWithProducts(store$.state)).toEqual(quoteRequestItems);
      expect(getActiveQuoteRequest(store$.state)).toBeUndefined();
    });

    it('should set loading to false and set error state', () => {
      store$.dispatch(new LoadQuoteRequestItemsFail({ error: { message: 'invalid' } as HttpError }));
      expect(getQuoteRequestLoading(store$.state)).toBeFalse();
      expect(getQuoteRequestItemsWithProducts(store$.state)).toBeEmpty();
      expect(getQuoteRequestError(store$.state)).toEqual({ message: 'invalid' });
    });
  });

  describe('loading an active quote request', () => {
    beforeEach(() => {
      const quoteRequests = [
        { id: 'test', items: [] },
        { id: 'test2', editable: true, items: [{ title: 'item1' }], state: 'New' },
      ] as QuoteRequestData[];
      store$.dispatch(new LoadQuoteRequestsSuccess({ quoteRequests }));
      const quoteRequestItems = [{ id: 'item1', productSKU: 'test' }] as QuoteRequestItem[];
      store$.dispatch(new LoadQuoteRequestItemsSuccess({ quoteRequestItems }));
      store$.dispatch(new LoadProductSuccess({ product: { sku: 'test' } as Product }));
    });

    it('should have a product on the active quote request', () => {
      const activeQuoteRequest = getActiveQuoteRequestWithProducts(store$.state);
      expect(activeQuoteRequest).toBeTruthy();
      const items = activeQuoteRequest.items;
      expect(items).toHaveLength(1);
      expect(items[0]).toHaveProperty('product.sku', 'test');
    });
  });
});
