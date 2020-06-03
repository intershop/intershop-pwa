import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable } from 'rxjs';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { ShoppingStoreModule } from 'ish-core/store/shopping/shopping-store.module';

import { AddToCompare, RemoveFromCompare, ToggleCompare } from './compare.actions';
import { CompareEffects } from './compare.effects';

describe('Compare Effects', () => {
  let actions$: Observable<Action>;
  let effects: CompareEffects;
  let store$: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(), ShoppingStoreModule.forTesting('compare')],
      providers: [CompareEffects, provideMockActions(() => actions$)],
    });

    effects = TestBed.inject(CompareEffects);
    store$ = TestBed.inject(Store);
  });

  describe('toggleCompare$', () => {
    it('should switch to ADD action', () => {
      const sku = '123';

      const action = new ToggleCompare({ sku });
      const completion = new AddToCompare({ sku });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.toggleCompare$).toBeObservable(expected$);
    });

    it('should switch to REMOVE action', () => {
      const sku = '123';
      store$.dispatch(new AddToCompare({ sku }));

      const action = new ToggleCompare({ sku });
      const completion = new RemoveFromCompare({ sku });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.toggleCompare$).toBeObservable(expected$);
    });
  });
});
