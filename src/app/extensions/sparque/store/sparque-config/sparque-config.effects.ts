import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { map, switchMap } from 'rxjs/operators';

import { whenFalsy } from 'ish-core/utils/operators';
import { StatePropertiesService } from 'ish-core/utils/state-transfer/state-properties.service';

import { SparqueConfig } from '../../models/sparque-config/sparque-config.model';

import { loadSparqueConfig, setSparqueConfig } from './sparque-config.actions';
import { getSparqueConfig } from './sparque-config.selectors';

@Injectable()
export class SparqueConfigEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private statePropertiesService: StatePropertiesService
  ) {}

  loadSparqueConfiguration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadSparqueConfig),
      switchMap(() =>
        this.statePropertiesService
          .getStateOrEnvOrDefault<SparqueConfig>('SPARQUE', 'sparque')
          .pipe(map(config => setSparqueConfig({ config })))
      )
    )
  );

  loadConfigOnInit$ = createEffect(() =>
    this.store.pipe(
      select(getSparqueConfig),
      whenFalsy(),
      map(() => loadSparqueConfig())
    )
  );
}
