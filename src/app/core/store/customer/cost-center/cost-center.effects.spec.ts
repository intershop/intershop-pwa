import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable } from 'rxjs';

import { loadCostCenter } from './cost-center.actions';
import { CostCenterEffects } from './cost-center.effects';

describe('Cost Center Effects', () => {
  let actions$: Observable<Action>;
  let effects: CostCenterEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CostCenterEffects, provideMockActions(() => actions$)],
    });

    effects = TestBed.inject(CostCenterEffects);
  });

  describe('loadCostCenter$', () => {
    it('should not dispatch actions when encountering loadCostCenter', () => {
      const action = loadCostCenter();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('------');

      expect(effects.loadCostCenter$).toBeObservable(expected$);
    });
  });
});
