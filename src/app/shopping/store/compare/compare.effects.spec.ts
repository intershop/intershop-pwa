import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { TestActions, testActionsFactory } from '../../../dev-utils/test.actions';
import { ShoppingState } from '../shopping.state';
import { reducers } from '../shopping.system';
import * as fromActions from './compare.actions';
import { CompareEffects } from './compare.effects';

describe('CompareEffects', () => {
  let actions$: TestActions;
  let effects: CompareEffects;
  let store: Store<ShoppingState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          shopping: combineReducers(reducers)
        }),
      ],
      providers: [
        CompareEffects,
        { provide: Actions, useFactory: testActionsFactory },
      ],
    });

    actions$ = TestBed.get(Actions);
    effects = TestBed.get(CompareEffects);
    store = TestBed.get(Store);
  });

  describe('toggleCompare$', () => {

    it('should switch to ADD action', () => {
      const sku = '123';

      const action = new fromActions.ToggleCompare(sku);
      const completion = new fromActions.AddToCompare(sku);

      actions$.stream = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.toggleCompare$).toBeObservable(expected$);
    });

    it('should switch to REMOVE action', () => {
      const sku = '123';
      store.dispatch(new fromActions.AddToCompare(sku));

      const action = new fromActions.ToggleCompare(sku);
      const completion = new fromActions.RemoveFromCompare(sku);

      actions$.stream = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.toggleCompare$).toBeObservable(expected$);
    });

  });
});
