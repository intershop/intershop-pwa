import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { routerNavigatedAction } from '@ngrx/router-store';
import { Store, select } from '@ngrx/store';
import { combineLatest, from, of } from 'rxjs';
import {
  catchError,
  concatMap,
  distinctUntilChanged,
  filter,
  map,
  mapTo,
  switchMap,
  switchMapTo,
  take,
  throttleTime,
  withLatestFrom,
} from 'rxjs/operators';

import { generateProductUrl } from 'ish-core/routing/product/product.route';
import { displayErrorMessage, displaySuccessMessage } from 'ish-core/store/core/messages';
import { selectRouteParam, selectUrl } from 'ish-core/store/core/router';
import { getLoggedInUser } from 'ish-core/store/customer/user';
import { getSelectedProduct } from 'ish-core/store/shopping/products';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import { TactonSelfServiceApiService } from '../../services/tacton-self-service-api/tacton-self-service-api.service';
import { getSavedTactonConfiguration } from '../saved-tacton-configuration';
import { getTactonProductForSelectedProduct } from '../tacton-config';

import {
  acceptTactonConfigurationConflictResolution,
  changeTactonConfigurationStep,
  clearTactonConfiguration,
  commitTactonConfigurationValue,
  continueConfigureTactonProduct,
  setCurrentConfiguration,
  startConfigureTactonProduct,
  submitTactonConfiguration,
  submitTactonConfigurationFail,
  submitTactonConfigurationSuccess,
  uncommitTactonConfigurationValue,
} from './product-configuration.actions';
import { getCurrentProductConfigurationStepName } from './product-configuration.selectors';

@Injectable()
export class ProductConfigurationEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private tactonSelfServiceApiService: TactonSelfServiceApiService,
    private router: Router
  ) {}

  startOrContinueTactonProductConfiguration$ = createEffect(() =>
    combineLatest([
      this.store.pipe(select(getTactonProductForSelectedProduct), whenTruthy()),
      this.store.pipe(
        select(selectUrl),
        map(url => url?.startsWith('/configure')),
        distinctUntilChanged()
      ),
      this.store.pipe(select(getLoggedInUser), whenTruthy()),
    ]).pipe(
      filter(([, url]) => !!url),
      switchMap(([productPath]) =>
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
        this.tactonSelfServiceApiService.continueConfiguration(savedConfig).pipe(
          map(configuration => setCurrentConfiguration({ configuration })),
          catchError(() => of(startConfigureTactonProduct({ productPath: savedConfig.productId })))
        )
      )
    )
  );

  routeToActiveConfigurationStep$ = createEffect(
    () =>
      this.store.pipe(
        select(getCurrentProductConfigurationStepName),
        withLatestFrom(
          this.store.pipe(select(selectRouteParam('sku'))),
          this.store.pipe(select(selectRouteParam('mainStep')))
        ),
        filter(([step, , previous]) => step && previous !== step),
        switchMap(([step, sku]) => from(this.router.navigate(['/configure', sku, step])))
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

  acceptTactonConfigurationConflictResolution$ = createEffect(() =>
    this.actions$.pipe(
      ofType(commitTactonConfigurationValue),
      mapToPayload(),
      switchMap(({ valueId, value }) =>
        this.actions$.pipe(
          ofType(acceptTactonConfigurationConflictResolution),
          switchMap(() =>
            this.tactonSelfServiceApiService
              .acceptConflictResolution(valueId, value)
              .pipe(map(configuration => setCurrentConfiguration({ configuration })))
          )
        )
      )
    )
  );

  submitTactonConfiguration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(submitTactonConfiguration),
      switchMapTo(this.store.pipe(select(getTactonProductForSelectedProduct), whenTruthy(), take(1))),
      switchMap(productPath =>
        of(productPath).pipe(withLatestFrom(this.store.pipe(select(getSavedTactonConfiguration(productPath)))))
      ),
      switchMap(([, savedConfiguration]) =>
        this.tactonSelfServiceApiService.submitConfiguration(savedConfiguration).pipe(
          mapTo(
            submitTactonConfigurationSuccess({ productId: savedConfiguration.productId, user: savedConfiguration.user })
          ),
          mapErrorToAction(submitTactonConfigurationFail, {
            productId: savedConfiguration.productId,
            user: savedConfiguration.user,
          })
        )
      )
    )
  );

  submitTactonConfigurationSuccessToast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(submitTactonConfigurationSuccess),
      withLatestFrom(this.store.pipe(select(getLoggedInUser))),
      map(([, user]) =>
        displaySuccessMessage({
          message: 'tacton.submit.success.message',
          messageParams: { 0: user.email },
        })
      )
    )
  );

  submitTactonConfigurationErrorToast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(submitTactonConfigurationFail),
      mapTo(
        displayErrorMessage({
          message: 'tacton.submit.error.message',
        })
      )
    )
  );

  submitTactonConfigurationRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(submitTactonConfigurationSuccess, submitTactonConfigurationFail),
        withLatestFrom(this.store.pipe(select(getSelectedProduct))),
        switchMap(([, product]) => from(this.router.navigateByUrl(generateProductUrl(product))))
      ),
    { dispatch: false }
  );
}
