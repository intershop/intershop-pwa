import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { routerNavigatedAction, routerNavigationAction } from '@ngrx/router-store';
import { Store, select } from '@ngrx/store';
import { combineLatest, of } from 'rxjs';
import {
  concatMap,
  distinctUntilChanged,
  filter,
  map,
  mapTo,
  switchMap,
  switchMapTo,
  take,
  tap,
  throttleTime,
  withLatestFrom,
} from 'rxjs/operators';

import { ofPath, ofUrl, selectRouteParam, selectUrl } from 'ish-core/store/core/router';
import { mapToPayload, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import { TactonSelfServiceApiService } from '../../services/tacton-self-service-api/tacton-self-service-api.service';
import { getSavedTactonConfiguration } from '../saved-tacton-configuration';
import { getTactonProductForSelectedProduct, isGroupLevelNavigationEnabled } from '../tacton-config';

import {
  changeTactonConfigurationStep,
  clearTactonConfiguration,
  commitTactonConfigurationValue,
  continueConfigureTactonProduct,
  setCurrentConfiguration,
  startConfigureTactonProduct,
  uncommitTactonConfigurationValue,
} from './product-configuration.actions';
import {
  getCurrentProductConfiguration,
  getCurrentProductConfigurationStepName,
} from './product-configuration.selectors';

@Injectable()
export class ProductConfigurationEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private tactonSelfServiceApiService: TactonSelfServiceApiService,
    private router: Router
  ) {}

  startOrContinueTactonProductConfiguration$ = createEffect(() =>
    this.store.pipe(
      ofUrl(/^\/configure\/.*/),
      select(selectUrl),
      switchMapTo(this.store.pipe(select(getTactonProductForSelectedProduct))),
      distinctUntilChanged(),
      whenTruthy(),
      switchMap(productPath =>
        of(productPath).pipe(withLatestFrom(this.store.pipe(select(getSavedTactonConfiguration(productPath)))))
      ),
      map(([productPath, savedConfig]) =>
        savedConfig ? continueConfigureTactonProduct({ savedConfig }) : startConfigureTactonProduct({ productPath })
      )
    )
  );

  startTactonProductConfiguration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(startConfigureTactonProduct),
      mapToPayloadProperty('productPath'),
      switchMap(productPath =>
        this.tactonSelfServiceApiService
          .startConfiguration(productPath)
          .pipe(map(configuration => setCurrentConfiguration({ configuration })))
      )
    )
  );

  continueTactonProductConfiguration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(continueConfigureTactonProduct),
      mapToPayloadProperty('savedConfig'),
      switchMap(savedConfig =>
        this.tactonSelfServiceApiService
          .continueConfiguration(savedConfig)
          .pipe(map(configuration => setCurrentConfiguration({ configuration })))
      )
    )
  );

  selectFirstConfigurationStepIfUnset$ = createEffect(
    () =>
      this.store.pipe(
        ofUrl(/^\/configure\/.*/),
        select(getCurrentProductConfiguration),
        whenTruthy(),
        withLatestFrom(
          this.store.pipe(select(selectRouteParam('mainStep'))),
          this.store.pipe(select(selectRouteParam('sku'))),
          this.store.pipe(select(isGroupLevelNavigationEnabled))
        ),
        filter(([config, param]) => !param || !config.steps.map(s => s.name).includes(param)),
        map(([config, , sku, groupLevelNavigation]) => {
          const nav = ['/configure', sku, config.steps[0].name];
          if (groupLevelNavigation) {
            nav.push(config.steps[0].rootGroup.members[0].name);
          }
          return nav;
        }),
        tap(arr => {
          this.router.navigate(arr);
        })
      ),
    { dispatch: false }
  );

  clearConfigurationWhenRoutingAway$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      filter(action => !action.payload.routerState.url.startsWith('/configure')),
      mapTo(clearTactonConfiguration())
    )
  );

  switchConfigurationStepViaRouting$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigationAction),
      ofPath(['configure/:sku/:mainStep/:groupStep', 'configure/:sku/:mainStep']),
      switchMapTo(
        combineLatest([
          this.store.pipe(select(getCurrentProductConfigurationStepName), whenTruthy(), take(1)),
          this.store.pipe(select(selectRouteParam('mainStep')), whenTruthy(), take(1)),
        ])
      ),
      filter(([a, b]) => a !== b),
      map(([, step]) => changeTactonConfigurationStep({ step }))
    )
  );

  switchConfigurationStep$ = createEffect(() =>
    this.actions$.pipe(
      ofType(changeTactonConfigurationStep),
      mapToPayloadProperty('step'),
      switchMap(step =>
        this.tactonSelfServiceApiService
          .changeStep(step)
          .pipe(map(configuration => setCurrentConfiguration({ configuration })))
      )
    )
  );

  commitTactonConfigurationValue$ = createEffect(() =>
    this.actions$.pipe(
      ofType(commitTactonConfigurationValue),
      throttleTime(1000),
      mapToPayload(),
      concatMap(({ valueId, value }) =>
        this.tactonSelfServiceApiService
          .commitValue(valueId, value)
          .pipe(map(configuration => setCurrentConfiguration({ configuration })))
      )
    )
  );

  uncommitTactonConfigurationValue$ = createEffect(() =>
    this.actions$.pipe(
      ofType(uncommitTactonConfigurationValue),
      throttleTime(1000),
      mapToPayload(),
      concatMap(({ valueId }) =>
        this.tactonSelfServiceApiService
          .uncommitValue(valueId)
          .pipe(map(configuration => setCurrentConfiguration({ configuration })))
      )
    )
  );
}
