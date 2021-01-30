import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { filter, map, mapTo, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';

import { getProductEntities, loadProductSuccess, productSpecialUpdate } from 'ish-core/store/shopping/products';
import { mapToPayloadProperty, whenFalsy, whenTruthy } from 'ish-core/utils/operators';
import { StatePropertiesService } from 'ish-core/utils/state-transfer/state-properties.service';

import { loadTactonConfig, setTactonConfig } from './tacton-config.actions';
import { getTactonConfig } from './tacton-config.selectors';

@Injectable()
export class TactonConfigEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private statePropertiesService: StatePropertiesService
  ) {}

  loadTactonConfiguration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTactonConfig),
      switchMap(() =>
        this.statePropertiesService.getStateOrEnvOrDefault<string | object>('TACTON', 'tacton').pipe(
          map(config => (typeof config === 'string' ? JSON.parse(config) : config)),
          map(config => setTactonConfig({ config }))
        )
      )
    )
  );

  loadConfigOnInit$ = createEffect(() =>
    this.store.pipe(select(getTactonConfig), whenFalsy(), mapTo(loadTactonConfig()))
  );

  setSpecialTactonProductOnProductLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProductSuccess),
      mapToPayloadProperty('product'),
      withLatestFrom(this.store.pipe(select(getTactonConfig))),
      filter(([product, config]) => !!config && !!config?.productMappings?.[product.sku]),
      map(([{ sku }]) => productSpecialUpdate({ sku, update: { type: 'TactonProduct' } }))
    )
  );

  setSpecialTactonProductOnConfigLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setTactonConfig),
      mapToPayloadProperty('config'),
      whenTruthy(),
      withLatestFrom(this.store.pipe(select(getProductEntities))),
      mergeMap(([config, entities]) =>
        Object.keys(entities)
          .filter(sku => !!config && !!config?.productMappings?.[sku])
          .map(sku => productSpecialUpdate({ sku, update: { type: 'TactonProduct' } }))
      )
    )
  );
}
