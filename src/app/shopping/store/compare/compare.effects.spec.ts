import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store, StoreModule, combineReducers } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable } from 'rxjs';

import { shoppingReducers } from '../shopping.system';

import * as fromActions from './compare.actions';
import { CompareEffects } from './compare.effects';

describe('Compare Effects', () => {
  let actions$: Observable<Action>;
  let effects: CompareEffects;
  let store$: Store<{}>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          shopping: combineReducers(shoppingReducers),
        }),
      ],
      providers: [CompareEffects, provideMockActions(() => actions$)],
    });

    effects = TestBed.get(CompareEffects);
    store$ = TestBed.get(Store);
  });

  describe('toggleCompare$', () => {
    it('should switch to ADD action', () => {
      const sku = '123';

      const action = new fromActions.ToggleCompare(sku);
      const completion = new fromActions.AddToCompare(sku);

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.toggleCompare$).toBeObservable(expected$);
    });

    it('should switch to REMOVE action', () => {
      const sku = '123';
      store$.dispatch(new fromActions.AddToCompare(sku));

      const action = new fromActions.ToggleCompare(sku);
      const completion = new fromActions.RemoveFromCompare(sku);

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.toggleCompare$).toBeObservable(expected$);
    });
  });
});
