import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { BasketBaseData } from 'ish-core/models/basket/basket.interface';
import { Customer } from 'ish-core/models/customer/customer.model';
import { BasketService } from 'ish-core/services/basket/basket.service';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { displaySuccessMessage } from 'ish-core/store/core/messages';
import { createBasket, loadBasketWithId } from 'ish-core/store/customer/basket';
import { CustomerStoreModule } from 'ish-core/store/customer/customer-store.module';
import { loadOrdersForBuyingContext } from 'ish-core/store/customer/orders';
import { loginUserSuccess } from 'ish-core/store/customer/user';

import { OrganizationHierarchiesGroup } from '../../models/organization-hierarchies-group/organization-hierarchies-group.model';
import { OrganizationHierarchiesService } from '../../services/organization-hierarchies/organization-hierarchies.service';
import { assignBuyingContextSuccess } from '../buying-context/buying-context.actions';
import { OrganizationHierarchiesStoreModule } from '../organization-hierarchies-store.module';

import {
  assignGroup,
  createGroup,
  deleteGroup,
  loadGroups,
  loadGroupsSuccess,
} from './organization-hierarchies-group.actions';
import { OrganizationHierarchiesGroupEffects } from './organization-hierarchies-group.effects';

describe('Organization Hierarchies Group Effects', () => {
  let actions$: Observable<Action>;
  let effects: OrganizationHierarchiesGroupEffects;
  let orgServiceMock: OrganizationHierarchiesService;
  let basketServiceMock: BasketService;
  let store: Store;

  const basket = { id: '1', calculated: true, totals: undefined } as BasketBaseData;
  const baskets = [basket] as BasketBaseData[];
  const customer = { customerNo: 'patricia' } as Customer;
  const root = { id: 'rootID', displayName: 'rootName' };
  const selectedGroup = { id: 'groupID', displayName: 'groupName', parentid: 'root' };
  const groups = [
    root,
    selectedGroup,
    { id: 'subgroup', parentid: 'root', displayName: 'subGroupName' },
  ] as OrganizationHierarchiesGroup[];

  beforeEach(() => {
    orgServiceMock = mock(OrganizationHierarchiesService);
    basketServiceMock = mock(BasketService);
    when(orgServiceMock.getGroups(anything())).thenReturn(of(groups));

    TestBed.configureTestingModule({
      imports: [
        CoreStoreModule.forTesting(),
        CustomerStoreModule.forTesting('user'),
        OrganizationHierarchiesStoreModule.forTesting('group'),
        RouterTestingModule.withRoutes([
          { path: 'cost-centers/:CostCenterId', children: [] },
          { path: '**', children: [] },
        ]),
      ],
      providers: [
        { provide: BasketService, useFactory: () => instance(basketServiceMock) },
        { provide: OrganizationHierarchiesService, useFactory: () => instance(orgServiceMock) },
        OrganizationHierarchiesGroupEffects,
        provideMockActions(() => actions$),
      ],
    });

    effects = TestBed.inject(OrganizationHierarchiesGroupEffects);
    store = TestBed.inject(Store);
  });

  describe('loadGroups$', () => {
    it('should dispatch loadGroupsSuccess actions when encountering loadGroups actions', () => {
      const action = loadGroups();
      const completion1 = loadGroupsSuccess({ groups });
      const completion2 = assignGroup({ id: root.id });
      actions$ = hot('-a----a----a', { a: action });
      const expected$ = cold('-(cd)-(cd)-(cd)', { c: completion1, d: completion2 });

      expect(effects.loadGroups$).toBeObservable(expected$);
    });
  });

  describe('assignGroup$', () => {
    beforeEach(() => {
      store.dispatch(loginUserSuccess({ customer }));
      store.dispatch(loadGroupsSuccess({ groups }));
      store.dispatch(assignGroup({ id: 'subgroup' }));
    });

    it('should dispatch action of type AssignBuyingContextSuccess when triggered by AssignGroup', () => {
      const action = assignGroup({ id: selectedGroup.id });
      actions$ = of(action);
      const completion = assignBuyingContextSuccess({
        bctx: groups[1].id.concat('@', customer.customerNo),
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });
      expect(effects.assignGroup$).toBeObservable(expected$);
    });
  });

  describe('reloadContext$', () => {
    it('should call the basketService for getBaskets', done => {
      when(basketServiceMock.getBaskets()).thenReturn(of(undefined));

      const action = assignBuyingContextSuccess({
        bctx: groups[1].id.concat('@', customer.customerNo),
      });
      actions$ = of(action);

      effects.reloadContext$.subscribe(() => {
        verify(basketServiceMock.getBaskets()).once();
        done();
      });
    });

    it('should dispatch action of type LoadBasketWithId and LoadOrdersWithGroupPaths when baskets existing', () => {
      when(basketServiceMock.getBaskets()).thenReturn(of(baskets));
      const action = assignBuyingContextSuccess({
        bctx: groups[1].id.concat('@', customer.customerNo),
      });
      const completion1 = loadBasketWithId({ basketId: basket.id });
      const completion2 = loadOrdersForBuyingContext({ query: { limit: 5 } });
      actions$ = hot('-a----a----a', { a: action });
      const expected$ = cold('-(cd)-(cd)-(cd)', { c: completion1, d: completion2 });

      expect(effects.reloadContext$).toBeObservable(expected$);
    });

    it('should dispatch only action of type CreateBasket and LoadOrdersWithGroupPaths when no baskets existing', () => {
      when(basketServiceMock.getBaskets()).thenReturn(of([]));
      const action = assignBuyingContextSuccess({
        bctx: groups[1].id.concat('@', customer.customerNo),
      });
      const completion1 = createBasket();
      const completion2 = loadOrdersForBuyingContext({ query: { limit: 5 } });
      actions$ = hot('-a----a----a', { a: action });
      const expected$ = cold('-(cd)-(cd)-(cd)', { c: completion1, d: completion2 });

      expect(effects.reloadContext$).toBeObservable(expected$);
    });
  });

  describe('createNewGroup$', () => {
    beforeEach(() => {
      store.dispatch(loadGroupsSuccess({ groups }));
    });

    it('should dispatch action of type loadGroups when triggered by CreateGroup', () => {
      when(orgServiceMock.createGroup(anything(), anything())).thenReturn(
        of({ id: 'leafID', displayName: 'leafName', parentGroupId: selectedGroup.id })
      );

      const action = createGroup({ parentGroupId: selectedGroup.id, child: { id: 'leafID', displayName: 'leafName' } });
      actions$ = of(action);
      const completion1 = loadGroups();
      const completion2 = displaySuccessMessage({
        message: 'account.organization.hierarchies.groups.new.confirmation',
        messageParams: { 0: 'leafName' },
      });
      actions$ = hot('-a----a----a', { a: action });
      const expected$ = cold('-(cd)-(cd)-(cd)', { c: completion1, d: completion2 });
      expect(effects.createNewGroup$).toBeObservable(expected$);
    });
  });

  describe('deleteGroup$', () => {
    beforeEach(() => {
      store.dispatch(loadGroupsSuccess({ groups }));
    });

    it('should dispatch action of type loadGroups when triggered by DeleteGroup', () => {
      when(orgServiceMock.deleteGroup(anything())).thenReturn(of({}));

      const action = deleteGroup({ groupId: selectedGroup.id });
      actions$ = of(action);
      const completion1 = loadGroups();
      const completion2 = displaySuccessMessage({
        message: 'account.organization.hierarchies.groups.delete.confirmation',
        messageParams: { 0: selectedGroup.id },
      });
      actions$ = hot('-a----a----a', { a: action });
      const expected$ = cold('-(cd)-(cd)-(cd)', { c: completion1, d: completion2 });
      expect(effects.deleteGroup$).toBeObservable(expected$);
    });
  });
});
