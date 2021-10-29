import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { from } from 'rxjs';
import { concatMap, exhaustMap, map, mergeMap, mergeMapTo } from 'rxjs/operators';

import { displaySuccessMessage } from 'ish-core/store/core/messages/messages.actions';
import { selectRouteParam } from 'ish-core/store/core/router';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import { CostCentersService } from '../../services/cost-centers/cost-centers.service';

import {
  addCostCenter,
  addCostCenterBuyers,
  addCostCenterBuyersFail,
  addCostCenterBuyersSuccess,
  addCostCenterFail,
  addCostCenterSuccess,
  deleteCostCenter,
  deleteCostCenterBuyer,
  deleteCostCenterBuyerFail,
  deleteCostCenterBuyerSuccess,
  deleteCostCenterFail,
  deleteCostCenterSuccess,
  loadCostCenter,
  loadCostCenterFail,
  loadCostCenterSuccess,
  loadCostCenters,
  loadCostCentersFail,
  loadCostCentersSuccess,
  updateCostCenter,
  updateCostCenterBuyer,
  updateCostCenterBuyerFail,
  updateCostCenterBuyerSuccess,
  updateCostCenterFail,
  updateCostCenterSuccess,
} from './cost-centers.actions';

@Injectable()
export class CostCentersEffects {
  constructor(
    private actions$: Actions,
    private costCentersService: CostCentersService,
    private router: Router,
    private store: Store
  ) {}

  loadCostCenters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCostCenters),
      exhaustMap(() =>
        this.costCentersService.getCostCenters().pipe(
          map(costCenters => loadCostCentersSuccess({ costCenters })),
          mapErrorToAction(loadCostCentersFail)
        )
      )
    )
  );

  triggerLoadCostCenter$ = createEffect(() =>
    this.store.pipe(
      select(selectRouteParam('CostCenterId')),
      whenTruthy(),
      map(costCenterId => loadCostCenter({ costCenterId }))
    )
  );

  loadCostCenter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCostCenter),
      mapToPayloadProperty('costCenterId'),
      mergeMap(costCenterId =>
        this.costCentersService.getCostCenter(costCenterId).pipe(
          map(costCenter => loadCostCenterSuccess({ costCenter })),
          mapErrorToAction(loadCostCenterFail)
        )
      )
    )
  );

  addCostCenter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addCostCenter),
      mapToPayloadProperty('costCenter'),
      concatMap(cc =>
        this.costCentersService.addCostCenter(cc).pipe(
          concatMap(costCenter =>
            this.navigateTo(`../${costCenter.id}`).pipe(
              mergeMapTo([
                addCostCenterSuccess({ costCenter }),
                displaySuccessMessage({
                  message: 'account.organization.cost_center_management.create.confirmation',
                  messageParams: { 0: `${costCenter.name}` },
                }),
              ])
            )
          ),
          mapErrorToAction(addCostCenterFail)
        )
      )
    )
  );

  updateCostCenter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateCostCenter),
      mapToPayloadProperty('costCenter'),
      concatMap(cc =>
        this.costCentersService.updateCostCenter(cc).pipe(
          concatMap(costCenter =>
            this.navigateTo('../').pipe(
              mergeMapTo([
                updateCostCenterSuccess({ costCenter }),
                displaySuccessMessage({
                  message: 'account.organization.cost_center_management.update.confirmation',
                  messageParams: { 0: `${costCenter.name}` },
                }),
              ])
            )
          ),
          mapErrorToAction(updateCostCenterFail)
        )
      )
    )
  );

  deleteCostCenter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteCostCenter),
      mapToPayloadProperty('id'),
      exhaustMap(id =>
        this.costCentersService.deleteCostCenter(id).pipe(
          mergeMap(() => [
            deleteCostCenterSuccess({ id }),
            displaySuccessMessage({
              message: 'account.organization.cost_center_management.delete.confirmation',
            }),
          ]),
          mapErrorToAction(deleteCostCenterFail)
        )
      )
    )
  );

  addCostCenterBuyers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addCostCenterBuyers),
      mapToPayload(),
      mergeMap(payload =>
        this.costCentersService.addCostCenterBuyers(payload.costCenterId, payload.buyers).pipe(
          concatMap(costCenter => this.navigateTo('../').pipe(map(() => addCostCenterBuyersSuccess({ costCenter })))),
          mapErrorToAction(addCostCenterBuyersFail)
        )
      )
    )
  );

  updateCostCenterBuyer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateCostCenterBuyer),
      mapToPayload(),
      mergeMap(payload =>
        this.costCentersService.updateCostCenterBuyer(payload.costCenterId, payload.buyer).pipe(
          map(costCenter => updateCostCenterBuyerSuccess({ costCenter })),
          mapErrorToAction(updateCostCenterBuyerFail)
        )
      )
    )
  );

  deleteCostCenterBuyer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteCostCenterBuyer),
      mapToPayload(),
      mergeMap(payload =>
        this.costCentersService.deleteCostCenterBuyer(payload.costCenterId, payload.login).pipe(
          map(costCenter => deleteCostCenterBuyerSuccess({ costCenter })),
          mapErrorToAction(deleteCostCenterBuyerFail)
        )
      )
    )
  );

  private navigateTo(path: string) {
    // find current ActivatedRoute by following first activated children
    let currentRoute = this.router.routerState.root;
    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }
    return from(this.router.navigate([path], { relativeTo: currentRoute }));
  }
}
