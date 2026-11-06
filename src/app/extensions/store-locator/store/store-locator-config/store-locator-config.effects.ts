import { Injectable, isDevMode } from '@angular/core';
import { Actions, createEffect } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { filter, map, take } from 'rxjs/operators';

import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { whenTruthy } from 'ish-core/utils/operators';
import { StatePropertiesService } from 'ish-core/utils/state-transfer/state-properties.service';

import { setGMAKey } from '.';

@Injectable()
export class StoreLocatorConfigEffects {
  constructor(
    private actions$: Actions,
    private featureToggleService: FeatureToggleService,
    private stateProperties: StatePropertiesService
  ) {}

  setGMAKey$ = createEffect(() =>
    this.actions$.pipe(
      take(1),
      filter(() => (SSR || isDevMode()) && this.featureToggleService.enabled('storeLocator')),
      concatLatestFrom(() => this.stateProperties.getStateOrEnvOrDefault<string>('GMA_KEY', 'gmaKey')),
      map(([, gmaKey]) => gmaKey),
      whenTruthy(),
      map(gmaKey => setGMAKey({ gmaKey }))
    )
  );
}
