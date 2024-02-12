import { NgModule, Type } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule, routerReducer } from '@ngrx/router-store';
import { ActionReducerMap, MetaReducer, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { configurationMeta } from 'ish-core/configurations/configuration.meta';
import { ngrxStateTransferMeta } from 'ish-core/configurations/ngrx-state-transfer';

import { ConfigurationEffects } from './configuration/configuration.effects';
import { configurationReducer } from './configuration/configuration.reducer';
import { CoreState } from './core-store';
import { ErrorEffects } from './error/error.effects';
import { errorReducer } from './error/error.reducer';
import { MessagesEffects } from './messages/messages.effects';
import { CustomRouterSerializer } from './router/router.serializer';
import { ServerConfigEffects } from './server-config/server-config.effects';
import { serverConfigReducer } from './server-config/server-config.reducer';
import { ViewconfEffects } from './viewconf/viewconf.effects';
import { viewconfReducer } from './viewconf/viewconf.reducer';
import { WishlistEffects } from './wishlist/wishlist.effects';
import { wishlistReducer } from './wishlist/wishlist.reducer';

const coreReducers: ActionReducerMap<CoreState> = {
  router: routerReducer,
  error: errorReducer,
  viewconf: viewconfReducer,
  configuration: configurationReducer,
  serverConfig: serverConfigReducer,
  wishlist: wishlistReducer,
};

const coreEffects = [
  ErrorEffects,
  ViewconfEffects,
  ConfigurationEffects,
  MessagesEffects,
  ServerConfigEffects,
  WishlistEffects,
];

const coreMetaReducers: MetaReducer<CoreState>[] = [
  ngrxStateTransferMeta,
  ...(PRODUCTION_MODE ? [] : [configurationMeta]),
];

@NgModule({
  imports: [
    StoreModule.forRoot<CoreState>(coreReducers, {
      metaReducers: coreMetaReducers,
      runtimeChecks: {
        strictActionImmutability: NGRX_RUNTIME_CHECKS,
        strictActionSerializability: NGRX_RUNTIME_CHECKS,
        strictStateImmutability: NGRX_RUNTIME_CHECKS,
        strictStateSerializability: NGRX_RUNTIME_CHECKS,
        strictActionTypeUniqueness: NGRX_RUNTIME_CHECKS,
      },
    }),
    StoreRouterConnectingModule.forRoot({
      serializer: CustomRouterSerializer,
    }),
    EffectsModule.forRoot(coreEffects),
  ],
})
export class CoreStoreModule {
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
