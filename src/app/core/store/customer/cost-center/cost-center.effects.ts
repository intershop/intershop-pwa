import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap } from 'rxjs/operators';

import { CostCenterService } from 'ish-core/services/cost-center/cost-center.service';
import { mapErrorToAction } from 'ish-core/utils/operators';

import { loadCostCenter, loadCostCenterFail, loadCostCenterSuccess } from './cost-center.actions';

@Injectable()
export class CostCenterEffects {
  constructor(private actions$: Actions, private costCenterService: CostCenterService) {}

  loadCostCenter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCostCenter),
      mergeMap(() =>
        this.costCenterService.getCostCenterForBusinessUser().pipe(
          map(costCenter => loadCostCenterSuccess({ costCenter })),
          mapErrorToAction(loadCostCenterFail)
        )
      )
    )
  );
}
