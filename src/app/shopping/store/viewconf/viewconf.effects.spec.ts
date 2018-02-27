import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { routerReducer } from '@ngrx/router-store';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { navigateMockAction } from '../../../dev-utils/navigate-mock.action';
import { TestActions, testActionsFactory } from '../../../dev-utils/test.actions';
import * as fromProducts from '../products';
import { ShoppingState } from '../shopping.state';
import { reducers } from '../shopping.system';
import * as fromActions from './viewconf.actions';
import { ViewconfEffects } from './viewconf.effects';

describe('ProductsEffects', () => {
  let actions$: TestActions;
  let effects: ViewconfEffects;
  let store: Store<ShoppingState>;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          shopping: combineReducers(reducers),
          routerReducer
        }),
      ],
      providers: [
        ViewconfEffects,
        { provide: Actions, useFactory: testActionsFactory }
      ],
    });

    actions$ = TestBed.get(Actions);
    effects = TestBed.get(ViewconfEffects);
    store = TestBed.get(Store);
  });

  describe('changeSortBy$', () => {
    it('should do nothing if no category is selected', () => {
      const action = new fromActions.ChangeSortBy('name-desc');
      actions$.stream = hot('-a-a-a', { a: action });
      expect(effects.changeSortBy$).toBeObservable(cold('-'));
    });

    it('should map to action of type LoadProductsForCategory if category is selected', () => {
      const categoryUniqueId = '123';
      const routerAction = navigateMockAction({
        url: `/category/${categoryUniqueId}`,
        params: { categoryUniqueId }
      });
      store.dispatch(routerAction);

      const action = new fromActions.ChangeSortBy('name-desc');
      const completion = new fromProducts.LoadProductsForCategory(categoryUniqueId);
      actions$.stream = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.changeSortBy$).toBeObservable(expected$);
    });
  });

});
