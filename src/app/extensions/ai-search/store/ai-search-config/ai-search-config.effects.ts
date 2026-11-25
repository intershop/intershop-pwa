import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { map, switchMap, take } from 'rxjs/operators';

import { whenFalsy } from 'ish-core/utils/operators';
import { StatePropertiesService } from 'ish-core/utils/state-transfer/state-properties.service';

import { AiSearchConfig } from '../../models/ai-search-config/ai-search-config.model';

import { aiSearchConfigInternalActions } from './ai-search-config.actions';
import { getAiSearchConfig } from './ai-search-config.selectors';

@Injectable()
export class AiSearchConfigEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private statePropertiesService: StatePropertiesService
  ) {}

  loadAiSearchConfig$ = createEffect(() =>
    this.actions$.pipe(
      ofType(aiSearchConfigInternalActions.loadConfig),
      switchMap(() =>
        this.statePropertiesService.getStateOrEnvOrDefault<AiSearchConfig>('AI_SEARCH', 'aiSearch').pipe(
          take(1),
          // a missing configuration is kept as an empty one, so AI Search requests fail at once instead of waiting
          map(config =>
            aiSearchConfigInternalActions.setConfig({ config: config ?? { apiHost: undefined, chatflowid: undefined } })
          )
        )
      )
    )
  );

  loadAiSearchConfigOnInit$ = createEffect(() =>
    this.store.pipe(
      select(getAiSearchConfig),
      whenFalsy(),
      map(() => aiSearchConfigInternalActions.loadConfig())
    )
  );
}
