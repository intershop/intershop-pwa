import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';

import { CoreStoreProviders } from 'ish-core/store/core/core-store.providers';

import { CompareStoreProviders } from '../compare-store.providers';

import { addToCompare, removeFromCompare, toggleCompare } from './compare.actions';
import { CompareEffects } from './compare.effects';

describe('Compare Effects', () => {
  let actions$: Observable<Action>;
  let effects: CompareEffects;
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CompareStoreProviders.forTesting('_compare'), ...CoreStoreProviders.forTesting()],
      providers: [CompareEffects, provideMockActions(() => actions$)],
    });

    effects = TestBed.inject(CompareEffects);
    store = TestBed.inject(Store);
  });

  describe('toggleCompare$', () => {
    it('should switch to ADD action', () => {
      const sku = '123';

      const action = toggleCompare({ sku });
      const completion = addToCompare({ sku });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.toggleCompare$).toBeObservable(expected$);
    });

    it('should switch to REMOVE action', () => {
      const sku = '123';
      store.dispatch(addToCompare({ sku }));

      const action = toggleCompare({ sku });
      const completion = removeFromCompare({ sku });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.toggleCompare$).toBeObservable(expected$);
    });
  });
});
