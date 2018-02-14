import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { TestActions, testActionsFactory } from '../../../dev-utils/test.actions';
import { ShoppingState } from '../shopping.state';
import { reducers } from '../shopping.system';
import * as fromActions from './compare-list.actions';
import { CompareListEffects } from './compare-list.effects';

describe('CompareListEffects', () => {
  let actions$: TestActions;
  let effects: CompareListEffects;
  let store: Store<ShoppingState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          shopping: combineReducers(reducers)
        }),
      ],
      providers: [
        CompareListEffects,
        { provide: Actions, useFactory: testActionsFactory },
      ],
    });

    actions$ = TestBed.get(Actions);
    effects = TestBed.get(CompareListEffects);
    store = TestBed.get(Store);
  });

  describe('toggleCompare$', () => {

    it('should switch to ADD action', () => {
      const sku = '123';

      const action = new fromActions.ToggleCompare(sku);
      const completion = new fromActions.AddToCompareList(sku);

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.toggleCompare$).toBeObservable(expected);
    });

    it('should switch to REMOVE action', () => {
      const sku = '123';
      store.dispatch(new fromActions.AddToCompareList(sku));

      const action = new fromActions.ToggleCompare(sku);
      const completion = new fromActions.RemoveFromCompareList(sku);

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.toggleCompare$).toBeObservable(expected);
    });

  });
});
