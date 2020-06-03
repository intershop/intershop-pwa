import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { routerNavigationAction } from '@ngrx/router-store';
import { Store, select } from '@ngrx/store';
import { concatMap, map, mapTo, switchMapTo } from 'rxjs/operators';

import { ConfigurationService } from 'ish-core/services/configuration/configuration.service';
import { mapErrorToAction, whenFalsy } from 'ish-core/utils/operators';

import {
  LoadServerConfig,
  LoadServerConfigFail,
  LoadServerConfigSuccess,
  ServerConfigActionTypes,
} from './server-config.actions';
import { isServerConfigurationLoaded } from './server-config.selectors';

@Injectable()
export class ServerConfigEffects {
  constructor(private actions$: Actions, private store: Store, private configService: ConfigurationService) {}

  /**
   * get server configuration on routing event, if it is not already loaded
   */
  @Effect()
  loadServerConfigOnInit$ = this.actions$.pipe(
    ofType(routerNavigationAction),
    switchMapTo(this.store.pipe(select(isServerConfigurationLoaded))),
    whenFalsy(),
    mapTo(new LoadServerConfig())
  );

  @Effect()
  loadServerConfig$ = this.actions$.pipe(
    ofType<LoadServerConfig>(ServerConfigActionTypes.LoadServerConfig),
    concatMap(() =>
      this.configService.getServerConfiguration().pipe(
        map(config => new LoadServerConfigSuccess({ config })),
        mapErrorToAction(LoadServerConfigFail)
      )
    )
  );
}
