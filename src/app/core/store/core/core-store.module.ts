import { NgModule, Type } from '@angular/core';
import { Router } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule, routerReducer } from '@ngrx/router-store';
import { ActionReducerMap, MetaReducer, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { configurationMeta } from 'ish-core/configurations/configuration.meta';
import { ngrxStateTransferMeta } from 'ish-core/configurations/ngrx-state-transfer';
import { ConfigurationGuard } from 'ish-core/guards/configuration.guard';
import { addGlobalGuard } from 'ish-core/utils/routing';

import { environment } from '../../../../environments/environment';

import { ConfigurationEffects } from './configuration/configuration.effects';
import { configurationReducer } from './configuration/configuration.reducer';
import { CoreState } from './core-store';
import { ErrorEffects } from './error/error.effects';
import { errorReducer } from './error/error.reducer';
import { MessagesEffects } from './messages/messages.effects';
import { CustomRouterSerializer } from './router/router.serializer';
import { ViewconfEffects } from './viewconf/viewconf.effects';
import { viewconfReducer } from './viewconf/viewconf.reducer';

/** @deprecated will be made private in version 0.23 */
export const coreReducers: ActionReducerMap<CoreState> = {
  router: routerReducer,
  error: errorReducer,
  viewconf: viewconfReducer,
  configuration: configurationReducer,
};

/** @deprecated will be made private in version 0.23 */
export const coreEffects = [ErrorEffects, ViewconfEffects, ConfigurationEffects, MessagesEffects];

// tslint:disable: deprecation

const coreMetaReducers: MetaReducer<CoreState>[] = [ngrxStateTransferMeta, configurationMeta];

@NgModule({
  imports: [
    // tslint:disable-next-line: ng-module-sorted-fields
    StoreModule.forRoot<CoreState>(coreReducers, {
      metaReducers: coreMetaReducers,
      runtimeChecks: {
        strictActionImmutability: !environment.production,
        strictActionSerializability: !environment.production,
        strictStateImmutability: !environment.production,
        strictStateSerializability: !environment.production,
      },
    }),
    StoreRouterConnectingModule.forRoot({ serializer: CustomRouterSerializer }),
    EffectsModule.forRoot(coreEffects),
  ],
})
export class CoreStoreModule {
  constructor(router: Router) {
    addGlobalGuard(router, ConfigurationGuard);
  }

  /**
   * Instantiate {@link CoreStoreModule} for testing.
   *
   * Automatically instantiates router-store if reducer 'router' is requested.
   *
   * @param reducers array of reducers
   * @param effects use 'true' to instantiate EffectsModule or use an array of effects directly
   * @param metaReducers optional array of meta reducers
   */
  static forTesting(
    reducers: (keyof ActionReducerMap<CoreState>)[] = [],
    effects: Type<unknown>[] | boolean = false,
    metaReducers: MetaReducer<CoreState>[] = []
  ) {
    const modules = [
      StoreModule.forRoot<CoreState>(pick(coreReducers, reducers), {
        metaReducers,
        runtimeChecks: {
          strictActionImmutability: true,
          strictActionSerializability: true,
          strictStateImmutability: true,
          strictStateSerializability: true,
        },
      }),
    ];
    if (typeof effects === 'boolean') {
      if (effects) {
        modules.push(EffectsModule.forRoot([]));
      }
    } else {
      modules.push(EffectsModule.forRoot(effects));
    }
    if (reducers.includes('router')) {
      modules.push(StoreRouterConnectingModule.forRoot({ serializer: CustomRouterSerializer }));
    }
    return modules;
  }
}
