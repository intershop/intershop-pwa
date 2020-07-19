import { TestBed } from '@angular/core/testing';

import { Product } from 'ish-core/models/product/product.model';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { loadProductSuccess } from 'ish-core/store/shopping/products';
import { ShoppingStoreModule } from 'ish-core/store/shopping/shopping-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { QuoteRequestItem } from '../../models/quote-request-item/quote-request-item.model';
import { QuoteRequestData } from '../../models/quote-request/quote-request.interface';
import { QuotingStoreModule } from '../quoting-store.module';

import {
  loadQuoteRequestItems,
  loadQuoteRequestItemsFail,
  loadQuoteRequestItemsSuccess,
  loadQuoteRequests,
  loadQuoteRequestsFail,
  loadQuoteRequestsSuccess,
  selectQuoteRequest,
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
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreStoreModule.forTesting(),
        QuotingStoreModule.forTesting('quoteRequest'),
        ShoppingStoreModule.forTesting('products', 'categories'),
      ],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('with empty state', () => {
    it('should be present if no quoteRequest are present', () => {
      expect(getCurrentQuoteRequests(store$.state)).toBeEmpty();
    });
  });

  describe('selecting a quote request', () => {
    beforeEach(() => {
      store$.dispatch(
        loadQuoteRequestsSuccess({
          quoteRequests: [
            { id: 'test', items: [] },
            { id: 'test2', editable: true, items: [] },
          ] as QuoteRequestData[],
        })
      );
      store$.dispatch(loadProductSuccess({ product: { sku: 'test' } as Product }));
      store$.dispatch(
        loadQuoteRequestItemsSuccess({ quoteRequestItems: [{ productSKU: 'test' }] as QuoteRequestItem[] })
      );
      store$.dispatch(selectQuoteRequest({ id: 'test' }));
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
      store$.dispatch(loadQuoteRequests());
    });

    it('should set the state to loading', () => {
      expect(getQuoteRequestLoading(store$.state)).toBeTrue();
    });

    it('should set loading to false and set quote state', () => {
      const quoteRequests = [
        { id: 'test', items: [] },
        { id: 'test2', editable: true, items: [], state: 'New' },
      ] as QuoteRequestData[];
      store$.dispatch(loadQuoteRequestsSuccess({ quoteRequests }));

      expect(getQuoteRequestLoading(store$.state)).toBeFalse();
      expect(getActiveQuoteRequest(store$.state)).toEqual(quoteRequests[1]);
    });

    it('should set loading to false and set error state', () => {
      store$.dispatch(loadQuoteRequestsFail({ error: makeHttpError({ message: 'invalid' }) }));
      expect(getQuoteRequestLoading(store$.state)).toBeFalse();
      expect(getQuoteRequestError(store$.state)).toMatchInlineSnapshot(`
        Object {
          "message": "invalid",
          "name": "HttpErrorResponse",
        }
      `);
    });
  });

  describe('loading quote request item list', () => {
    beforeEach(() => {
      store$.dispatch(loadQuoteRequestItems({ id: 'test' }));
    });

    it('should set the state to loading', () => {
      expect(getQuoteRequestLoading(store$.state)).toBeTrue();
    });

    it('should set loading to false and set quote state', () => {
      const quoteRequestItems = [{ productSKU: 'test' }] as QuoteRequestItem[];
      store$.dispatch(loadQuoteRequestItemsSuccess({ quoteRequestItems }));

      expect(getQuoteRequestLoading(store$.state)).toBeFalse();
      expect(getQuoteRequestItemsWithProducts(store$.state)).toEqual(quoteRequestItems);
      expect(getActiveQuoteRequest(store$.state)).toBeUndefined();
    });

    it('should set loading to false and set error state', () => {
      store$.dispatch(loadQuoteRequestItemsFail({ error: makeHttpError({ message: 'invalid' }) }));
      expect(getQuoteRequestLoading(store$.state)).toBeFalse();
      expect(getQuoteRequestItemsWithProducts(store$.state)).toBeEmpty();
      expect(getQuoteRequestError(store$.state)).toMatchInlineSnapshot(`
        Object {
          "message": "invalid",
          "name": "HttpErrorResponse",
        }
      `);
    });
  });

  describe('loading an active quote request', () => {
    beforeEach(() => {
      const quoteRequests = [
        { id: 'test', items: [] },
        { id: 'test2', editable: true, items: [{ title: 'item1' }], state: 'New' },
      ] as QuoteRequestData[];
      store$.dispatch(loadQuoteRequestsSuccess({ quoteRequests }));
      const quoteRequestItems = [{ id: 'item1', productSKU: 'test' }] as QuoteRequestItem[];
      store$.dispatch(loadQuoteRequestItemsSuccess({ quoteRequestItems }));
      store$.dispatch(loadProductSuccess({ product: { sku: 'test' } as Product }));
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
