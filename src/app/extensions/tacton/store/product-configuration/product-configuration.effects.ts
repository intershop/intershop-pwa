import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { concatMap, filter, map, switchMap, tap, throttleTime, withLatestFrom } from 'rxjs/operators';

import { selectRouteParam } from 'ish-core/store/core/router';
import { mapToPayload, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import { TactonSelfServiceApiService } from '../../services/tacton-self-service-api/tacton-self-service-api.service';

import {
  commitTactonConfigurationValue,
  setCurrentConfiguration,
  startConfigureTactonProduct,
} from './product-configuration.actions';
import { getCurrentProductConfiguration } from './product-configuration.selectors';

@Injectable()
export class ProductConfigurationEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private tactonSelfServiceApiService: TactonSelfServiceApiService,
    private router: Router
  ) {}

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

  selectFirstConfigurationStep$ = createEffect(
    () =>
      this.store.pipe(
        select(getCurrentProductConfiguration),
        whenTruthy(),
        withLatestFrom(
          this.store.pipe(select(selectRouteParam('mainStep'))),
          this.store.pipe(select(selectRouteParam('sku')))
        ),
        filter(([config, param]) => !param || !config.steps.map(s => s.name).includes(param)),
        map(([config, , sku]) => ['/configure', sku, config.steps[0].name, config.steps[0].rootGroup.members[0].name]),
        tap(arr => {
          this.router.navigate(arr);
        })
      ),
    { dispatch: false }
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
}
