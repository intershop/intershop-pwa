import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { routerNavigationAction } from '@ngrx/router-store';
import { Store, select } from '@ngrx/store';
import { identity } from 'rxjs';
import { concatMap, first, map, switchMap } from 'rxjs/operators';

import { ConfigurationService } from 'ish-core/services/configuration/configuration.service';
import { serverConfigError } from 'ish-core/store/core/error';
import { mapErrorToAction, mapToPayloadProperty, whenFalsy } from 'ish-core/utils/operators';

import { loadServerConfig, loadServerConfigFail, loadServerConfigSuccess } from './server-config.actions';
import { isServerConfigurationLoaded } from './server-config.selectors';

@Injectable()
export class ServerConfigEffects {
  constructor(private actions$: Actions, private store: Store, private configService: ConfigurationService) {}

  /**
   * get server configuration on routing event, if it is not already loaded
   */
  loadServerConfigOnInit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigationAction),
      SSR ? first() : identity,
      switchMap(() => this.store.pipe(select(isServerConfigurationLoaded))),
      whenFalsy(),
      map(() => loadServerConfig())
    )
  );

  loadServerConfig$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadServerConfig),
      concatMap(() =>
        this.configService.getServerConfiguration().pipe(
          map(config => loadServerConfigSuccess({ config })),
          mapErrorToAction(loadServerConfigFail)
        )
      )
    )
  );

  mapToServerConfigError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadServerConfigFail),
      mapToPayloadProperty('error'),
      map(error => serverConfigError({ error }))
    )
  );
}
