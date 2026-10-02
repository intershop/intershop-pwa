import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { map, switchMap, take } from 'rxjs/operators';

import { whenFalsy } from 'ish-core/utils/operators';
import { StatePropertiesService } from 'ish-core/utils/state-transfer/state-properties.service';

import { CopilotEmbeddedConfig } from '../../models/copilot-embedded-config/copilot-embedded-config.model';

import { copilotEmbeddedConfigInternalActions } from './copilot-embedded-config.actions';
import { getCopilotEmbeddedConfig } from './copilot-embedded-config.selectors';

@Injectable()
export class CopilotEmbeddedConfigEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private statePropertiesService: StatePropertiesService
  ) {}

  loadCopilotEmbeddedConfig$ = createEffect(() =>
    this.actions$.pipe(
      ofType(copilotEmbeddedConfigInternalActions.loadCopilotEmbeddedConfig),
      switchMap(() =>
        this.statePropertiesService
          .getStateOrEnvOrDefault<CopilotEmbeddedConfig>('COPILOT_EMBEDDED', 'copilotEmbedded')
          .pipe(
            take(1),
            map(config => copilotEmbeddedConfigInternalActions.setCopilotEmbeddedConfig({ config }))
          )
      )
    )
  );

  loadCopilotEmbeddedConfigOnInit$ = createEffect(() =>
    this.store.pipe(
      select(getCopilotEmbeddedConfig),
      whenFalsy(),
      map(() => copilotEmbeddedConfigInternalActions.loadCopilotEmbeddedConfig())
    )
  );
}
