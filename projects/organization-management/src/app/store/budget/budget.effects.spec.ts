import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable, of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { Price } from 'ish-core/models/price/price.model';

import { UsersService } from '../../services/users/users.service';

import { loadBudget, loadBudgetSuccess } from './budget.actions';
import { BudgetEffects } from './budget.effects';

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

describe('Budget Effects', () => {
  let actions$: Observable<Action>;
  let effects: BudgetEffects;
  let usersService: UsersService;

  beforeEach(() => {
    usersService = mock(UsersService);
    when(usersService.getCurrentUserBudget()).thenReturn(of(budget));

    TestBed.configureTestingModule({
      providers: [
        BudgetEffects,
        provideMockActions(() => actions$),
        { provide: UsersService, useFactory: () => instance(usersService) },
      ],
    });

    effects = TestBed.inject(BudgetEffects);
  });

  describe('loadBudget$', () => {
    it('should dispatch actions when encountering loadBudget', () => {
      const action = loadBudget();
      const response = loadBudgetSuccess({ budget });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-b-b-b', { b: response });

      expect(effects.loadBudget$).toBeObservable(expected$);
    });
  });
});
