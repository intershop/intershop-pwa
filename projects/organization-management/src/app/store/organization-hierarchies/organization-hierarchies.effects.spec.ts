import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { anyString, instance, mock, verify, when } from 'ts-mockito';

import { Customer } from 'ish-core/models/customer/customer.model';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { CustomerStoreModule } from 'ish-core/store/customer/customer-store.module';
import { loginUserSuccess } from 'ish-core/store/customer/user';

import { NodeHelper } from '../../models/node/node.helper';
import { OrganizationHierarchiesService } from '../../services/organization-hierarchies/organization-hierarchies.service';
import { OrganizationManagementStoreModule } from '../organization-management-store.module';

import { loadGroups } from './organization-hierarchies.actions';
import { OrganizationHierarchiesEffects } from './organization-hierarchies.effects';

@Component({ template: 'dummy' })
class DummyComponent {}

describe('Organization Hierarchies Effects', () => {
  let actions$: Observable<Action>;
  let effects: OrganizationHierarchiesEffects;
  let orgServiceMock: OrganizationHierarchiesService;
  let store$: Store;

  beforeEach(() => {
    orgServiceMock = mock(OrganizationHierarchiesService);
    when(orgServiceMock.getNodes(anyString())).thenReturn(of(NodeHelper.empty()));

    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        CoreStoreModule.forTesting(['router']),
        CustomerStoreModule.forTesting('user'),
        OrganizationManagementStoreModule.forTesting('organizationHierarchies'),
        RouterTestingModule.withRoutes([
          { path: 'users/:B2BCustomerLogin', component: DummyComponent },
          { path: 'users/:B2BCustomerLogin/edit', component: DummyComponent },
          { path: '**', component: DummyComponent },
        ]),
      ],
      providers: [
        OrganizationHierarchiesEffects,
        provideMockActions(() => actions$),
        { provide: OrganizationHierarchiesService, useFactory: () => instance(orgServiceMock) },
      ],
    });

    effects = TestBed.inject(OrganizationHierarchiesEffects);
    store$ = TestBed.inject(Store);
    const customer = { customerNo: 'patricia' } as Customer;
    store$.dispatch(loginUserSuccess({ customer }));
  });

  describe('loadOrganizationHierarchies$', () => {
    it('should call the service for retrieving groups', done => {
      actions$ = of(loadGroups());

      effects.loadOrganizationHierarchies$.subscribe(() => {
        verify(orgServiceMock.getNodes('patricia')).once();
        done();
      });
    });

    it('should retrieve groups when triggered', done => {
      actions$ = of(loadGroups());

      effects.loadOrganizationHierarchies$.subscribe(action => {
        expect(action).toMatchInlineSnapshot(`
          [Organization Hierarchies API] Load Groups Success:
            nodeTree: tree()
          `);
        done();
      });
    });
  });
});
