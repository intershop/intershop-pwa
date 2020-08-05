import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { map, mapTo, switchMap } from 'rxjs/operators';

import { whenFalsy } from 'ish-core/utils/operators';
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
}
