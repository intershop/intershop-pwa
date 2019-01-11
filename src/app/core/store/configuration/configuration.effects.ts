import { Injectable } from '@angular/core';
import { Actions, Effect, ROOT_EFFECTS_INIT, ofType } from '@ngrx/effects';
import { map, take, withLatestFrom } from 'rxjs/operators';

import { StatePropertiesService } from 'ish-core/utils/state-transfer/state-properties.service';

import { ApplyConfiguration } from './configuration.actions';

@Injectable()
export class ConfigurationEffects {
  constructor(private actions$: Actions, private stateProperties: StatePropertiesService) {}

  @Effect()
  setInitialRestEndpoint$ = this.actions$.pipe(
    ofType(ROOT_EFFECTS_INIT),
    take(1),
    withLatestFrom(
      this.stateProperties.getStateOrEnvOrDefault<string>('ICM_BASE_URL', 'icmBaseURL'),
      this.stateProperties.getStateOrEnvOrDefault<string>('ICM_SERVER', 'icmServer'),
      this.stateProperties.getStateOrEnvOrDefault<string>('ICM_SERVER_STATIC', 'icmServerStatic'),
      this.stateProperties.getStateOrEnvOrDefault<string>('ICM_CHANNEL', 'icmChannel'),
      this.stateProperties
        .getStateOrEnvOrDefault<string | string[]>('FEATURES', 'features')
        .pipe(map(x => (typeof x === 'string' ? x.split(/,/g) : x)))
    ),
    map(
      ([, baseURL, server, serverStatic, channel, features]) =>
        new ApplyConfiguration({ baseURL, server, serverStatic, channel, features })
    )
  );
}
