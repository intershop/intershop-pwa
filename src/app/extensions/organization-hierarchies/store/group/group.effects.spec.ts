import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable, of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { BasketBaseData } from 'ish-core/models/basket/basket.interface';
import { BasketService } from 'ish-core/services/basket/basket.service';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { loadBasket } from 'ish-core/store/customer/basket';
import { CustomerStoreModule } from 'ish-core/store/customer/customer-store.module';
import { loadOrders } from 'ish-core/store/customer/orders';

import { OrganizationHierarchiesService } from '../../services/organization-hierarchies/organization-hierarchies.service';

import { assignGroup, loadGroups, loadGroupsSuccess } from './group.actions';
import { GroupEffects } from './group.effects';

describe('Group Effects', () => {
  let actions$: Observable<Action>;
  let effects: GroupEffects;
  let orgServiceMock: OrganizationHierarchiesService;
  let basketServiceMock: BasketService;

  const basket = { id: '1', calculated: true, totals: undefined } as BasketBaseData;
  const baskets = [basket] as BasketBaseData[];

  beforeEach(() => {
    orgServiceMock = mock(OrganizationHierarchiesService);
    basketServiceMock = mock(BasketService);
    when(orgServiceMock.getGroups(anything())).thenReturn(of([]));

    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(), CustomerStoreModule.forTesting('user')],
      providers: [
        GroupEffects,
        provideMockActions(() => actions$),
        { provide: OrganizationHierarchiesService, useFactory: () => instance(orgServiceMock) },
        { provide: BasketService, useFactory: () => instance(basketServiceMock) },
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

  describe('assignGroups$', () => {
    it('should call the basketService for getBaskets', done => {
      when(basketServiceMock.getBaskets()).thenReturn(of(undefined));

      const action = assignGroup({ id: 'HomeschoolingIstDoof' });
      actions$ = of(action);

      effects.assignGroup$.subscribe(() => {
        verify(basketServiceMock.getBaskets()).once();
        done();
      });
    });

    it('should dispatch action of type LoadBasket and LoadOrders', () => {
      when(basketServiceMock.getBaskets()).thenReturn(of(baskets));
      const action = assignGroup({ id: 'Anna' });
      const completion1 = loadBasket();
      const completion2 = loadOrders();
      actions$ = hot('-a----a----a', { a: action });
      const expected$ = cold('-(cd)-(cd)-(cd)', { c: completion1, d: completion2 });

      expect(effects.assignGroup$).toBeObservable(expected$);
    });

    it('should dispatch only action of type LoadOrders', () => {
      when(basketServiceMock.getBaskets()).thenReturn(of([]));
      const action = assignGroup({ id: 'Aaron' });
      const completion = loadOrders();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.assignGroup$).toBeObservable(expected$);
    });
  });
});
