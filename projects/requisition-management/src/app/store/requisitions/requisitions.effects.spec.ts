import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable } from 'rxjs';

import { loadRequisitions } from './requisitions.actions';
import { RequisitionsEffects } from './requisitions.effects';

describe('Requisitions Effects', () => {
  let actions$: Observable<Action>;
  let effects: RequisitionsEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RequisitionsEffects, provideMockActions(() => actions$)],
    });

    effects = TestBed.inject(RequisitionsEffects);
  });

  describe('loadRequisitions$', () => {
    it('should not dispatch actions when encountering loadRequisitions', () => {
      const action = loadRequisitions();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('------');

      expect(effects.loadRequisitions$).toBeObservable(expected$);
    });
  });
});
