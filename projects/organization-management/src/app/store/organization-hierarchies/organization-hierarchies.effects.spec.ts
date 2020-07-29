import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable } from 'rxjs';

import { loadOrganizationHierarchies } from './organization-hierarchies.actions';
import { OrganizationHierarchiesEffects } from './organization-hierarchies.effects';

describe('Organization Hierarchies Effects', () => {
  let actions$: Observable<Action>;
  let effects: OrganizationHierarchiesEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrganizationHierarchiesEffects, provideMockActions(() => actions$)],
    });

    effects = TestBed.inject(OrganizationHierarchiesEffects);
  });

  describe('loadOrganizationHierarchies$', () => {
    it('should not dispatch actions when encountering loadOrganizationHierarchies', () => {
      const action = loadOrganizationHierarchies();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('------');

      expect(effects.loadOrganizationHierarchies$).toBeObservable(expected$);
    });
  });
});
