import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, combineReducers, Store, StoreModule } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { Observable } from 'rxjs/Observable';
import { Product } from '../../../models/product/product.model';
import { LoadProductSuccess, SelectProduct } from '../products';
import { ShoppingState } from '../shopping.state';
import { shoppingReducers } from '../shopping.system';
import { AddToRecently } from './recently.actions';
import { RecentlyEffects } from './recently.effects';

describe('RecentlyEffects', () => {
  let actions$: Observable<Action>;
  let effects: RecentlyEffects;
  let store$: Store<ShoppingState>;

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
      store$.dispatch(new SelectProduct('A'));

      expect(effects.viewedProduct$).toBeObservable(cold('a', { a: new AddToRecently('A') }));
    });

    it('should not fire when product is deselected', () => {
      store$.dispatch(new SelectProduct(undefined));

      expect(effects.viewedProduct$).toBeObservable(cold('------'));
    });
  });
});
