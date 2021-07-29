import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CostCenterService } from 'ish-core/services/cost-center/cost-center.service';
import { mapErrorToAction } from 'ish-core/utils/operators';
import { map, mergeMap } from 'rxjs/operators';
import { loadUserCostCenter, loadUserCostCenterFail, loadUserCostCenterSuccess } from './cost-center.actions';

@Injectable()
export class CostCenterEffects {
  constructor(private actions$: Actions, private costCenterService: CostCenterService) {}

  loadCostCenter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUserCostCenter),
      mergeMap(() =>
        this.costCenterService.getCostCenterForBusinessUser().pipe(
          map(userCostCenter => loadUserCostCenterSuccess({ userCostCenter })),
          mapErrorToAction(loadUserCostCenterFail)
        )
      )
    )
  );
}
