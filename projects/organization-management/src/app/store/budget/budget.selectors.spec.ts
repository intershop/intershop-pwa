import { TestBed } from '@angular/core/testing';

import { Price } from 'ish-core/models/price/price.model';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { OrganizationManagementStoreModule } from '../organization-management-store.module';

import { loadBudget, loadBudgetFail, loadBudgetSuccess } from './budget.actions';
import { getCurrentUserBudget, getCurrentUserBudgetError, getCurrentUserBudgetLoading } from './budget.selectors';

const budget = {
  orderSpentLimit: {
    currency: 'USD',
    value: 500,
  } as Price,
  remainingBudget: {
    currency: 'USD',
    value: 8110.13,
  } as Price,
  spentBudget: {
    currency: 'USD',
    value: 1889.87,
  } as Price,
  budget: {
    currency: 'USD',
    value: 10000,
  } as Price,
  budgetPeriod: 'monthly',
};

describe('Budget Selectors', () => {
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(), OrganizationManagementStoreModule.forTesting('budget')],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('initial state', () => {
    it('should not be loading when in initial state', () => {
      expect(getCurrentUserBudgetLoading(store$.state)).toBeFalse();
    });
  });

  describe('loadBudget', () => {
    const action = loadBudget();

    beforeEach(() => {
      store$.dispatch(action);
    });

    it('should set loading to true', () => {
      expect(getCurrentUserBudgetLoading(store$.state)).toBeTrue();
    });
  });

  describe('loadBudgetSuccess', () => {
    beforeEach(() => {
      store$.dispatch(loadBudgetSuccess({ budget }));
    });

    it('should add loaded budget to store', () => {
      expect(getCurrentUserBudget(store$.state)).toEqual(budget);
    });
  });

  describe('loadBudgetFail', () => {
    beforeEach(() => {
      store$.dispatch(loadBudget());
      store$.dispatch(loadBudgetFail({ error: makeHttpError({ message: 'error' }) }));
    });
    it('should set loading and error correctly on loadBudgetFail', () => {
      expect(getCurrentUserBudgetError(store$.state)).toBeTruthy();
      expect(getCurrentUserBudgetLoading(store$.state)).toBeFalse();
    });
  });
});
