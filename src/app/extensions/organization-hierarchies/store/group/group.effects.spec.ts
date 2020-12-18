import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable, of } from 'rxjs';
import { anything, instance, mock, when } from 'ts-mockito';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { CustomerStoreModule } from 'ish-core/store/customer/customer-store.module';

import { OrganizationHierarchiesService } from '../../services/organization-hierarchies/organization-hierarchies.service';

import { loadGroups, loadGroupsSuccess } from './group.actions';
import { GroupEffects } from './group.effects';

describe('Group Effects', () => {
  let actions$: Observable<Action>;
  let effects: GroupEffects;
  let orgServiceMock: OrganizationHierarchiesService;

  beforeEach(() => {
    orgServiceMock = mock(OrganizationHierarchiesService);
    when(orgServiceMock.getGroups(anything())).thenReturn(of([]));

    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(), CustomerStoreModule.forTesting('user')],
      providers: [
        GroupEffects,
        provideMockActions(() => actions$),
        { provide: OrganizationHierarchiesService, useFactory: () => instance(orgServiceMock) },
      ],
    });

    effects = TestBed.inject(GroupEffects);
  });

  describe('loadGroups$', () => {
    it('should dispatch loadGroupsSuccess actions when encountering loadGroups actions', () => {
      const action = loadGroups();
      const completion = loadGroupsSuccess({ groups: [] });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadGroups$).toBeObservable(expected$);
    });
  });
});
