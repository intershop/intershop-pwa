import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule, combineReducers } from '@ngrx/store';

import { HttpError } from '../../../models/http-error/http-error.model';
import { Product } from '../../../models/product/product.model';
import { QuoteData } from '../../../models/quote/quote.interface';
import { Quote } from '../../../models/quote/quote.model';
import { LoadProductSuccess } from '../../../shopping/store/products';
import { shoppingReducers } from '../../../shopping/store/shopping.system';
import { LogEffects } from '../../../utils/dev/log.effects';
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
  let store$: LogEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          quoting: combineReducers(quotingReducers),
          shopping: combineReducers(shoppingReducers),
        }),
        EffectsModule.forRoot([LogEffects]),
      ],
    });

    store$ = TestBed.get(LogEffects);
  });

  describe('with empty state', () => {
    it('should be present if no quotes are present', () => {
      expect(getCurrentQuotes(store$.state)).toBeEmpty();
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

      expect(getSelectedQuoteId(store$.state)).toEqual('test');
      expect(getSelectedQuote(store$.state)).toEqual(expected);
    });
  });

  describe('loading quote list', () => {
    beforeEach(() => {
      store$.dispatch(new LoadQuotes());
    });

    it('should set the state to loading', () => {
      expect(getQuoteLoading(store$.state)).toBeTrue();
    });

    it('should set loading to false and set quote state', () => {
      const quotes = [{ id: 'test' }] as QuoteData[];
      store$.dispatch(new LoadQuotesSuccess(quotes));

      expect(getQuoteLoading(store$.state)).toBeFalse();
      expect(getCurrentQuotes(store$.state)).toEqual([{ id: 'test', state: 'Responded' } as Quote]);
    });

    it('should set loading to false and set error state', () => {
      store$.dispatch(new LoadQuotesFail({ message: 'invalid' } as HttpError));
      expect(getQuoteLoading(store$.state)).toBeFalse();
      expect(getCurrentQuotes(store$.state)).toBeEmpty();
      expect(getQuoteError(store$.state)).toEqual({ message: 'invalid' });
    });
  });
});
