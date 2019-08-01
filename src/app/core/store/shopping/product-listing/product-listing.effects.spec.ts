import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, StoreModule, combineReducers } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable } from 'rxjs';

import { ENDLESS_SCROLLING_ITEMS_PER_PAGE } from 'ish-core/configurations/injection-keys';
import { coreReducers } from 'ish-core/store/core-store.module';
import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';

import * as actions from './product-listing.actions';
import { ProductListingEffects } from './product-listing.effects';

describe('Product Listing Effects', () => {
  let actions$: Observable<Action>;
  let effects: ProductListingEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...coreReducers,
          shopping: combineReducers(shoppingReducers),
        }),
      ],
      providers: [
        ProductListingEffects,
        provideMockActions(() => actions$),
        { provide: ENDLESS_SCROLLING_ITEMS_PER_PAGE, useValue: 7 },
      ],
    });

    effects = TestBed.get(ProductListingEffects);
  });

  describe('initializePageSize$', () => {
    it('should set page size once and only for the first incoming action', () => {
      const action = { type: 'something' };
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-(b|)----', { b: new actions.SetEndlessScrollingPageSize({ itemsPerPage: 7 }) });

      expect(effects.initializePageSize$).toBeObservable(expected$);
    });
  });
});
