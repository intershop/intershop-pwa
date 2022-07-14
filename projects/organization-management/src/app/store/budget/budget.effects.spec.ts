import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of, throwError } from 'rxjs';
import { instance, mock, verify, when } from 'ts-mockito';

import { Price } from 'ish-core/models/price/price.model';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';

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
        { provide: UsersService, useFactory: () => instance(usersService) },
        BudgetEffects,
        provideMockActions(() => actions$),
      ],
    });

    effects = TestBed.inject(BudgetEffects);
  });

  describe('loadBudget$', () => {
    it('should call the usersService for loadBudget', done => {
      actions$ = of(loadBudget());

      effects.loadBudget$.subscribe(() => {
        verify(usersService.getCurrentUserBudget()).once();
        done();
      });
    });
    it('should dispatch loadBudgetSuccess when encountering loadBudget', done => {
      actions$ = of(loadBudget());

      effects.loadBudget$.subscribe(action => {
        expect(action).toMatchInlineSnapshot(`
          [Budget API] Load Budget Success:
            budget: {"orderSpentLimit":{"currency":"USD","value":500},"remaining...
        `);
        done();
      });
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

    it('should map an invalid request to action of type LoadBudgetFail', done => {
      when(usersService.getCurrentUserBudget()).thenReturn(throwError(() => makeHttpError({ message: 'ERROR' })));
      actions$ = of(loadBudget());

      effects.loadBudget$.subscribe(action => {
        expect(action).toMatchInlineSnapshot(`
          [Budget API] Load Budget Fail:
            error: {"name":"HttpErrorResponse","message":"ERROR"}
        `);
        done();
      });
    });
  });
});
