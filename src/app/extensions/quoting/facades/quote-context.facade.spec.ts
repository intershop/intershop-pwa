import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { getQuotingError, getQuotingLoading, isQuotingInitialized } from '../store/quoting';

import { QuoteContextFacade } from './quote-context.facade';

@Injectable()
class TestQuoteContextFacade extends QuoteContextFacade {}

describe('Quote Context Facade', () => {
  let context: QuoteContextFacade;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          selectors: [
            { selector: isQuotingInitialized, value: true },
            { selector: getQuotingLoading, value: false },
            { selector: getQuotingError, value: undefined },
          ],
        }),
        TestQuoteContextFacade,
      ],
    });

    context = TestBed.inject(TestQuoteContextFacade);
    store = TestBed.inject(MockStore);
  });

  describe('setItemQuantityError', () => {
    it('should not have item quantity errors initially', () => {
      expect(context.get('hasItemQuantityError')).toBeFalse();
    });

    it('should track item quantity errors until all items are valid again', () => {
      context.setItemQuantityError('item1', true);
      context.setItemQuantityError('item2', true);
      context.setItemQuantityError('item1', true);

      expect(context.get('itemsWithQuantityError')).toEqual(['item2', 'item1']);
      expect(context.get('hasItemQuantityError')).toBeTrue();

      context.setItemQuantityError('item1', false);
      context.setItemQuantityError('item2', false);

      expect(context.get('itemsWithQuantityError')).toBeEmpty();
      expect(context.get('hasItemQuantityError')).toBeFalse();
    });
  });

  describe('submit', () => {
    let dispatchSpy: jest.SpyInstance;

    beforeEach(() => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
    });

    it('should submit the quote request if items have no quantity errors', () => {
      context.submit();

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(context.get('justSubmitted')).toBeTrue();
    });

    it('should not submit the quote request if an item has a quantity error', () => {
      context.setItemQuantityError('item1', true);

      context.submit();

      expect(dispatchSpy).not.toHaveBeenCalled();
      expect(context.get('justSubmitted')).toBeFalsy();
    });
  });
});
