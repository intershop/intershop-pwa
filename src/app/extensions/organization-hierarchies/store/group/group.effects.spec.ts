import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jest-marbles';
import { Observable } from 'rxjs';
import { instance, mock } from 'ts-mockito';

import { Customer } from 'ish-core/models/customer/customer.model';
import { CustomerStoreModule } from 'ish-core/store/customer/customer-store.module';
import { getLoggedInCustomer } from 'ish-core/store/customer/user';

import { OrganizationHierarchiesService } from '../../services/organization-hierarchies/organization-hierarchies.service';

import { loadGroups } from './group.actions';
import { GroupEffects } from './group.effects';

@Component({ template: 'dummy' })
class DummyComponent {}

const customer = { customerNo: 'patricia' } as Customer;

describe('Group Effects', () => {
  let actions$: Observable<Action>;
  let effects: GroupEffects;
  let orgServiceMock: OrganizationHierarchiesService;

  beforeEach(() => {
    orgServiceMock = mock(OrganizationHierarchiesService);
    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [CustomerStoreModule.forTesting('user')],
      providers: [
        GroupEffects,
        provideMockActions(() => actions$),
        { provide: OrganizationHierarchiesService, useFactory: () => instance(orgServiceMock) },
        provideMockStore({
          selectors: [{ selector: getLoggedInCustomer, value: { customer } }],
        }),
      ],
    });

    effects = TestBed.inject(GroupEffects);
  });

  describe('loadGroups$', () => {
    it('should not dispatch actions when encountering loadGroups', () => {
      const action = loadGroups();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('------');

      expect(effects.loadGroup$).toBeObservable(expected$);
    });
  });
});
