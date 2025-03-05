import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { map, switchMap, take } from 'rxjs/operators';

import { whenFalsy } from 'ish-core/utils/operators';
import { StatePropertiesService } from 'ish-core/utils/state-transfer/state-properties.service';

import { CopilotConfig } from '../../models/copilot-config/copilot-config.model';

import { copilotConfigInternalActions } from './copilot-config.actions';
import { getCopilotConfig } from './copilot-config.selectors';

@Injectable()
export class CopilotConfigEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private statePropertiesService: StatePropertiesService
  ) {}

  loadCopilotConfiguration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(copilotConfigInternalActions.loadCopilotConfig),
      switchMap(() =>
        this.statePropertiesService.getStateOrEnvOrDefault<CopilotConfig>('COPILOT', 'copilot').pipe(
          // make sure to trigger the set action only once (was triggered twice for some reason)
          take(1),
          map(config => copilotConfigInternalActions.setCopilotConfig({ config }))
        )
      )
    )
  );

  loadCopilotConfigOnInit$ = createEffect(() =>
    this.store.pipe(
      select(getCopilotConfig),
      whenFalsy(),
      map(() => copilotConfigInternalActions.loadCopilotConfig())
    )
  );
}
