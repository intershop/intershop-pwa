import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { EMPTY, Observable } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import { loadCostCenter } from './cost-center.actions';

@Injectable()
export class CostCenterEffects {
  constructor(private actions$: Actions) {}

  loadCostCenter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCostCenter),
      concatMap(() => EMPTY as Observable<Action>)
    )
  );
}
