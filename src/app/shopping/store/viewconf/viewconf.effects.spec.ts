import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { routerReducer } from '@ngrx/router-store';
import { Action, combineReducers, Store, StoreModule } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { Observable } from 'rxjs/Observable';
import { navigateMockAction } from '../../../utils/dev/navigate-mock.action';
import * as fromProducts from '../products';
import { ShoppingState } from '../shopping.state';
import { shoppingReducers } from '../shopping.system';
import * as fromActions from './viewconf.actions';
import { ViewconfEffects } from './viewconf.effects';

describe('ViewconfEffects', () => {
  let actions$: Observable<Action>;
  let effects: ViewconfEffects;
  let store: Store<ShoppingState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          shopping: combineReducers(shoppingReducers),
          routerReducer,
        }),
      ],
      providers: [ViewconfEffects, provideMockActions(() => actions$)],
    });

    effects = TestBed.get(ViewconfEffects);
    store = TestBed.get(Store);
  });

  describe('changeSortBy$', () => {
    it('should do nothing if no category is selected', () => {
      const action = new fromActions.ChangeSortBy('name-desc');
      actions$ = hot('-a-a-a', { a: action });
      expect(effects.changeSortBy$).toBeObservable(cold('-'));
    });

    it('should map to action of type LoadProductsForCategory if category is selected', () => {
      const categoryUniqueId = '123';
      const routerAction = navigateMockAction({
        url: `/category/${categoryUniqueId}`,
        params: { categoryUniqueId },
      });
      store.dispatch(routerAction);

      const action = new fromActions.ChangeSortBy('name-desc');
      const completion = new fromProducts.LoadProductsForCategory(categoryUniqueId);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.changeSortBy$).toBeObservable(expected$);
    });
  });
});
