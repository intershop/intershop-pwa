import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { filter, map, mergeMap, switchMap } from 'rxjs/operators';

import { getProductEntities, loadProductSuccess, productSpecialUpdate } from 'ish-core/store/shopping/products';
import { mapToPayloadProperty, whenFalsy, whenTruthy } from 'ish-core/utils/operators';
import { StatePropertiesService } from 'ish-core/utils/state-transfer/state-properties.service';

import { TactonConfig } from '../../models/tacton-config/tacton-config.model';

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
        this.statePropertiesService
          .getStateOrEnvOrDefault<TactonConfig>('TACTON', 'tacton')
          .pipe(map(config => setTactonConfig({ config })))
      )
    )
  );

  loadConfigOnInit$ = createEffect(() =>
    this.store.pipe(
      select(getTactonConfig),
      whenFalsy(),
      map(() => loadTactonConfig())
    )
  );

  setSpecialTactonProductOnProductLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProductSuccess),
      mapToPayloadProperty('product'),
      concatLatestFrom(() => this.store.pipe(select(getTactonConfig))),
      filter(([product, config]) => !!config && !!config?.productMappings?.[product.sku]),
      map(([{ sku }]) => productSpecialUpdate({ sku, update: { type: 'TactonProduct' } }))
    )
  );

  setSpecialTactonProductOnConfigLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setTactonConfig),
      mapToPayloadProperty('config'),
      whenTruthy(),
      concatLatestFrom(() => this.store.pipe(select(getProductEntities))),
      mergeMap(([config, entities]) =>
        Object.keys(entities)
          .filter(sku => !!config && !!config?.productMappings?.[sku])
          .map(sku => productSpecialUpdate({ sku, update: { type: 'TactonProduct' } }))
      )
    )
  );
}
