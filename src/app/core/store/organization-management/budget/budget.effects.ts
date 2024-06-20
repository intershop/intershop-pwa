import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';

import { UsersService } from 'ish-core/services/users/users.service';
import { mapErrorToAction } from 'ish-core/utils/operators';

import { loadBudget, loadBudgetFail, loadBudgetSuccess } from './budget.actions';

@Injectable()
export class BudgetEffects {
  constructor(private actions$: Actions, private usersService: UsersService) {}

  loadBudget$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadBudget),
      switchMap(() =>
        this.usersService.getCurrentUserBudget().pipe(
          map(budget => loadBudgetSuccess({ budget })),
          mapErrorToAction(loadBudgetFail)
        )
      )
    )
  );
}
