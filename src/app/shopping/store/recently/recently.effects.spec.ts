import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store, StoreModule, combineReducers } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable } from 'rxjs';

import { Product } from '../../../models/product/product.model';
import { LoadProductSuccess, SelectProduct } from '../products';
import { shoppingReducers } from '../shopping.system';

import { AddToRecently } from './recently.actions';
import { RecentlyEffects } from './recently.effects';

describe('Recently Effects', () => {
  let actions$: Observable<Action>;
  let effects: RecentlyEffects;
  let store$: Store<{}>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          shopping: combineReducers(shoppingReducers),
        }),
      ],
      providers: [RecentlyEffects, provideMockActions(() => actions$)],
    });

    effects = TestBed.get(RecentlyEffects);
    store$ = TestBed.get(Store);
  });

  describe('viewedProduct$', () => {
    it('should not fire when product is not yet loaded', () => {
      actions$ = hot('a', { a: new SelectProduct('A') });

      expect(effects.viewedProduct$).toBeObservable(cold('------'));
    });

    it('should fire when product is in store and selected', () => {
      store$.dispatch(new LoadProductSuccess({ sku: 'A' } as Product));

      const action = new SelectProduct('A');
      store$.dispatch(action);

      actions$ = hot('---a', { a: action });

      expect(effects.viewedProduct$).toBeObservable(cold('---a', { a: new AddToRecently('A') }));
    });

    it('should not fire when product is deselected', () => {
      store$.dispatch(new SelectProduct(undefined));

      expect(effects.viewedProduct$).toBeObservable(cold('------'));
    });
  });
});
