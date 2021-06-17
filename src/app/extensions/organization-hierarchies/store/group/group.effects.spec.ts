import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable, of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { BasketBaseData } from 'ish-core/models/basket/basket.interface';
import { Customer } from 'ish-core/models/customer/customer.model';
import { BasketService } from 'ish-core/services/basket/basket.service';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { createBasket, loadBasketWithId } from 'ish-core/store/customer/basket';
import { CustomerStoreModule } from 'ish-core/store/customer/customer-store.module';
import { loginUserSuccess } from 'ish-core/store/customer/user';

import { OrganizationGroup } from '../../models/organization-group/organization-group.model';
import { OrganizationHierarchiesService } from '../../services/organization-hierarchies/organization-hierarchies.service';
import { assignBuyingContext, assignBuyingContextSuccess } from '../buying-context/buying-context.actions';
import { loadOrdersWithGroupPaths } from '../order-group-path/order-group-path.actions';
import { OrganizationHierarchiesStoreModule } from '../organization-hierarchies-store.module';

import { assignGroup, loadGroups, loadGroupsSuccess } from './group.actions';
import { GroupEffects } from './group.effects';

describe('Group Effects', () => {
  let actions$: Observable<Action>;
  let effects: GroupEffects;
  let orgServiceMock: OrganizationHierarchiesService;
  let basketServiceMock: BasketService;
  let store$: Store;

  const basket = { id: '1', calculated: true, totals: undefined } as BasketBaseData;
  const baskets = [basket] as BasketBaseData[];
  const customer = { customerNo: 'patricia' } as Customer;
  const selectedGroup = { id: 'root' };
  const groups = [selectedGroup, { id: 'subgroup', parentid: 'root' }] as OrganizationGroup[];

  beforeEach(() => {
    orgServiceMock = mock(OrganizationHierarchiesService);
    basketServiceMock = mock(BasketService);
    when(orgServiceMock.getGroups(anything())).thenReturn(of(groups));

    TestBed.configureTestingModule({
      imports: [
        CoreStoreModule.forTesting(),
        CustomerStoreModule.forTesting('user'),
        OrganizationHierarchiesStoreModule.forTesting('group'),
      ],
      providers: [
        GroupEffects,
        provideMockActions(() => actions$),
        { provide: OrganizationHierarchiesService, useFactory: () => instance(orgServiceMock) },
        { provide: BasketService, useFactory: () => instance(basketServiceMock) },
      ],
    });

    effects = TestBed.inject(GroupEffects);
    store$ = TestBed.inject(Store);
  });

  describe('loadGroups$', () => {
    it('should dispatch loadGroupsSuccess actions when encountering loadGroups actions', () => {
      const action = loadGroups();
      const completion1 = loadGroupsSuccess({ groups, selectedGroupId: undefined });
      const completion2 = assignBuyingContext();
      actions$ = hot('-a----a----a', { a: action });
      const expected$ = cold('-(cd)-(cd)-(cd)', { c: completion1, d: completion2 });

      expect(effects.loadGroups$).toBeObservable(expected$);
    });
    it('should dispatch loadGroupsSuccess actions when loadGroups actions triggered by reloading', () => {
      store$.dispatch(loadGroupsSuccess({ groups, selectedGroupId: selectedGroup.id }));

      const action = loadGroups();
      const completion1 = loadGroupsSuccess({ groups, selectedGroupId: selectedGroup.id });
      const completion2 = assignBuyingContext();
      actions$ = hot('-a----a----a', { a: action });
      const expected$ = cold('-(cd)-(cd)-(cd)', { c: completion1, d: completion2 });

      expect(effects.loadGroups$).toBeObservable(expected$);
    });
  });

  describe('assignGroup$', () => {
    beforeEach(() => {
      store$.dispatch(loginUserSuccess({ customer }));
      store$.dispatch(loadGroupsSuccess({ groups, selectedGroupId: undefined }));
      store$.dispatch(assignGroup({ id: 'subgroup' }));
    });

    it('should dispatch action of type AssignBuyingContextSuccess when triggered by AssignGroup', () => {
      const action = assignGroup({ id: 'subgroup' });
      actions$ = of(action);
      const completion = assignBuyingContextSuccess({ bctx: groups[1].id.concat('@', customer.customerNo) });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });
      expect(effects.assignGroup$).toBeObservable(expected$);
    });

    it('should dispatch action of type AssignBuyingContextSuccess when triggered by AssignBuyingContext', () => {
      const action = assignBuyingContext();
      actions$ = of(action);
      const completion = assignBuyingContextSuccess({ bctx: groups[1].id.concat('@', customer.customerNo) });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });
      expect(effects.assignGroup$).toBeObservable(expected$);
    });
  });

  describe('reloadContext$', () => {
    it('should call the basketService for getBaskets', done => {
      when(basketServiceMock.getBaskets()).thenReturn(of(undefined));

      const action = assignBuyingContextSuccess({ bctx: groups[1].id.concat('@', customer.customerNo) });
      actions$ = of(action);

      effects.reloadContext$.subscribe(() => {
        verify(basketServiceMock.getBaskets()).once();
        done();
      });
    });

    it('should dispatch action of type LoadBasketWithId and LoadOrdersWithGroupPaths when baskets existing', () => {
      when(basketServiceMock.getBaskets()).thenReturn(of(baskets));
      const action = assignBuyingContextSuccess({ bctx: groups[1].id.concat('@', customer.customerNo) });
      const completion1 = loadBasketWithId({ basketId: basket.id });
      const completion2 = loadOrdersWithGroupPaths();
      actions$ = hot('-a----a----a', { a: action });
      const expected$ = cold('-(cd)-(cd)-(cd)', { c: completion1, d: completion2 });

      expect(effects.reloadContext$).toBeObservable(expected$);
    });

    it('should dispatch only action of type CreateBasket and LoadOrdersWithGroupPaths when no baskets existing', () => {
      when(basketServiceMock.getBaskets()).thenReturn(of([]));
      const action = assignBuyingContextSuccess({ bctx: groups[1].id.concat('@', customer.customerNo) });
      const completion1 = createBasket();
      const completion2 = loadOrdersWithGroupPaths();
      actions$ = hot('-a----a----a', { a: action });
      const expected$ = cold('-(cd)-(cd)-(cd)', { c: completion1, d: completion2 });

      expect(effects.reloadContext$).toBeObservable(expected$);
    });
  });
});
