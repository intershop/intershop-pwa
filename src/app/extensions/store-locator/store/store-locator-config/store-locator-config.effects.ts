import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID, isDevMode } from '@angular/core';
import { Actions, createEffect } from '@ngrx/effects';
import { map, take, takeWhile, withLatestFrom } from 'rxjs/operators';

import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { whenTruthy } from 'ish-core/utils/operators';
import { StatePropertiesService } from 'ish-core/utils/state-transfer/state-properties.service';

import { setGMAKey } from '.';

@Injectable()
export class StoreLocatorConfigEffects {
  constructor(
    private actions$: Actions,
    @Inject(PLATFORM_ID) private platformId: string,
    private featureToggleService: FeatureToggleService,
    private stateProperties: StatePropertiesService
  ) {}

  setGMAKey$ = createEffect(() =>
    this.actions$.pipe(
      takeWhile(
        () => (isPlatformServer(this.platformId) || isDevMode()) && this.featureToggleService.enabled('storeLocator')
      ),
      take(1),
      withLatestFrom(this.stateProperties.getStateOrEnvOrDefault<string>('GMA_KEY', 'gmaKey')),
      map(([, gmaKey]) => gmaKey),
      whenTruthy(),
      map(gmaKey => setGMAKey({ gmaKey }))
    )
  );
}
