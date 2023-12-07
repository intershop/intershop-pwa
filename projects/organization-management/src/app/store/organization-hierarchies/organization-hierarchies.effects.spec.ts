import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of, throwError } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { Customer } from 'ish-core/models/customer/customer.model';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { displaySuccessMessage } from 'ish-core/store/core/messages';
import { CustomerStoreModule } from 'ish-core/store/customer/customer-store.module';
import { loginUserSuccess } from 'ish-core/store/customer/user';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';

import { Group } from '../../models/group/group.model';
import { OrganizationHierarchiesService } from '../../services/organization-hierarchies/organization-hierarchies.service';

import { createGroup, createGroupFail, createGroupSuccess, loadGroups } from './organization-hierarchies.actions';
import { OrganizationHierarchiesEffects } from './organization-hierarchies.effects';

@Component({ template: 'dummy' })
class DummyComponent {}

const customer = { customerNo: 'patricia' } as Customer;

describe('Organization Hierarchies Effects', () => {
  let actions$: Observable<Action>;
  let effects: OrganizationHierarchiesEffects;
  let orgServiceMock: OrganizationHierarchiesService;
  let store: Store;
  let location: Location;
  let router: Router;
  const parentGroup = {
    id: 'parent',
    name: 'Parent',
  } as Group;
  const childGroup = {
    id: 'child',
    name: 'Child',
  } as Group;

  beforeEach(() => {
    orgServiceMock = mock(OrganizationHierarchiesService);
    when(orgServiceMock.getGroups(customer)).thenReturn(of([]));
    when(orgServiceMock.createGroup(anything(), anything())).thenReturn(of(childGroup));

    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        CoreStoreModule.forTesting(['router']),
        CustomerStoreModule.forTesting('user'),
        RouterTestingModule.withRoutes([
          { path: 'hierarchies/', component: DummyComponent },
          { path: 'hierarchies/create-group', component: DummyComponent },
          { path: '**', component: DummyComponent },
        ]),
      ],
      providers: [
        { provide: OrganizationHierarchiesService, useFactory: () => instance(orgServiceMock) },
        OrganizationHierarchiesEffects,
        provideMockActions(() => actions$),
      ],
    });

    effects = TestBed.inject(OrganizationHierarchiesEffects);
    store = TestBed.inject(Store);
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    store.dispatch(loginUserSuccess({ customer }));
  });

  describe('loadOrganizationHierarchies$', () => {
    it('should call the service for retrieving groups', done => {
      actions$ = of(loadGroups());

      effects.loadOrganizationHierarchies$.subscribe(() => {
        verify(orgServiceMock.getGroups(customer)).once();
        done();
      });
    });

    it('should retrieve groups when triggered', done => {
      actions$ = of(loadGroups());

      effects.loadOrganizationHierarchies$.subscribe(action => {
        expect(action.payload).toMatchSnapshot(`{ "groups": [],}`);
        expect(action.type).toEqual(`[Organization Hierarchies API] Load Groups Success`);
        done();
      });
    });
  });

  describe('createNewGroup$', () => {
    it('should call the service for creating and adding new group', done => {
      actions$ = of(createGroup({ parentGroupId: parentGroup.id, child: childGroup }));

      effects.createNewGroup$.subscribe(() => {
        verify(orgServiceMock.createGroup(anything(), anything())).once();
        done();
      });
    });

    it('should create a user when triggered', () => {
      const action = createGroup({ parentGroupId: parentGroup.id, child: childGroup });

      const completion = createGroupSuccess({ group: childGroup });
      const completion2 = displaySuccessMessage({
        message: 'account.organization.hierarchies.groups.new.confirmation',
        messageParams: { 0: childGroup.name },
      });

      actions$ = hot('        -a----a----a---|', { a: action });
      const expected$ = cold('-(cd)-(cd)-(cd)|', { c: completion, d: completion2 });

      expect(effects.createNewGroup$).toBeObservable(expected$);
    });

    it('should dispatch an createGroupFail action on failed group creation', () => {
      const error = makeHttpError({ status: 401, code: 'feld' });
      when(orgServiceMock.createGroup(anything(), anything())).thenReturn(throwError(() => error));

      const action = createGroup({ parentGroupId: parentGroup.id, child: childGroup });
      const completion = createGroupFail({ error });

      actions$ = hot('        -a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.createNewGroup$).toBeObservable(expected$);
    });
  });

  describe('redirect after successfuly group creation', () => {
    it('should navigate to company structure on success', fakeAsync(() => {
      router.navigateByUrl('/hierarchies/create-group');
      tick(500);

      const action = createGroupSuccess({ group: childGroup });

      actions$ = of(action);

      effects.redirectAfterCreateNewGroup$.subscribe({
        next: () => {
          expect(location.path()).toMatchInlineSnapshot(`"/hierarchies"`);
        },
        error: fail,
      });
    }));
  });
});
