import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { routerNavigationAction } from '@ngrx/router-store';
import { Store, select } from '@ngrx/store';
import { identity } from 'rxjs';
import { concatMap, first, map, mapTo, switchMapTo } from 'rxjs/operators';

import { ConfigurationService } from 'ish-core/services/configuration/configuration.service';
import { mapErrorToAction, whenFalsy } from 'ish-core/utils/operators';

import { loadServerConfig, loadServerConfigFail, loadServerConfigSuccess } from './server-config.actions';
import { isServerConfigurationLoaded } from './server-config.selectors';

@Injectable()
export class ServerConfigEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private configService: ConfigurationService,
    @Inject(PLATFORM_ID) private platformId: string
  ) {}

  /**
   * get server configuration on routing event, if it is not already loaded
   */
  loadServerConfigOnInit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigationAction),
      isPlatformServer(this.platformId) ? first() : identity,
      switchMapTo(this.store.pipe(select(isServerConfigurationLoaded))),
      whenFalsy(),
      mapTo(loadServerConfig())
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
}
