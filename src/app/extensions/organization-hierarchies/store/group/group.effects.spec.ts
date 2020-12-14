import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable } from 'rxjs';

import { loadGroups } from './group.actions';
import { GroupEffects } from './group.effects';

describe('Group Effects', () => {
  let actions$: Observable<Action>;
  let effects: GroupEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GroupEffects, provideMockActions(() => actions$)],
    });

    effects = TestBed.inject(GroupEffects);
  });

  describe('loadGroup$', () => {
    it('should not dispatch actions when encountering loadGroup', () => {
      const action = loadGroups();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('------');

      expect(effects.loadGroup$).toBeObservable(expected$);
    });
  });
});
