import { TestBed } from '@angular/core/testing';

import { Product } from 'ish-core/models/product/product.model';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { loadProductSuccess } from 'ish-core/store/shopping/products';
import { ShoppingStoreModule } from 'ish-core/store/shopping/shopping-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { QuoteData } from '../../models/quote/quote.interface';
import { Quote } from '../../models/quote/quote.model';
import { QuotingStoreModule } from '../quoting-store.module';

import { loadQuotes, loadQuotesFail, loadQuotesSuccess, selectQuote } from './quote.actions';
import {
  getCurrentQuotes,
  getQuoteError,
  getQuoteLoading,
  getSelectedQuoteId,
  getSelectedQuoteWithProducts,
} from './quote.selectors';

describe('Quote Selectors', () => {
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreStoreModule.forTesting(),
        QuotingStoreModule.forTesting('quote'),
        ShoppingStoreModule.forTesting('products'),
      ],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('with empty state', () => {
    it('should be present if no quotes are present', () => {
      expect(getCurrentQuotes(store$.state)).toBeEmpty();
    });
  });

  describe('selecting a quote', () => {
    beforeEach(() => {
      store$.dispatch(
        loadQuotesSuccess({
          quotes: [
            { id: 'test', items: [{ productSKU: 'test' }] },
            { id: 'test2', items: [] },
          ] as QuoteData[],
        })
      );
      store$.dispatch(loadProductSuccess({ product: { sku: 'test' } as Product }));
      store$.dispatch(selectQuote({ id: 'test' }));
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

      expect(getSelectedQuoteId(store$.state)).toEqual('test');
      expect(getSelectedQuoteWithProducts(store$.state)).toEqual(expected);
    });
  });

  describe('loading quote list', () => {
    beforeEach(() => {
      store$.dispatch(loadQuotes());
    });

    it('should set the state to loading', () => {
      expect(getQuoteLoading(store$.state)).toBeTrue();
    });

    it('should set loading to false and set quote state', () => {
      const quotes = { quotes: [{ id: 'test' }] as QuoteData[] };
      store$.dispatch(loadQuotesSuccess(quotes));

      expect(getQuoteLoading(store$.state)).toBeFalse();
      expect(getCurrentQuotes(store$.state)).toEqual([{ id: 'test', state: 'Responded' } as Quote]);
    });

    it('should set loading to false and set error state', () => {
      store$.dispatch(loadQuotesFail({ error: makeHttpError({ message: 'invalid' }) }));
      expect(getQuoteLoading(store$.state)).toBeFalse();
      expect(getCurrentQuotes(store$.state)).toBeEmpty();
      expect(getQuoteError(store$.state)).toMatchInlineSnapshot(`
        Object {
          "message": "invalid",
          "name": "HttpErrorResponse",
        }
      `);
    });
  });
});
