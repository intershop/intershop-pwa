import { Injectable, InjectionToken, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreConfig, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { resetOnLogoutMeta } from 'ish-core/utils/meta-reducers';

import { CxmlConfigurationEffects } from './cxml-configuration/cxml-configuration.effects';
import { cxmlConfigurationReducer } from './cxml-configuration/cxml-configuration.reducer';
import { OciConfigurationEffects } from './oci-configuration/oci-configuration.effects';
import { ociConfigurationReducer } from './oci-configuration/oci-configuration.reducer';
import { PunchoutFunctionsEffects } from './punchout-functions/punchout-functions.effects';
import { PunchoutState } from './punchout-store';
import { PunchoutTypesEffects } from './punchout-types/punchout-types.effects';
import { punchoutTypesReducer } from './punchout-types/punchout-types.reducer';
import { PunchoutUsersEffects } from './punchout-users/punchout-users.effects';
import { punchoutUsersReducer } from './punchout-users/punchout-users.reducer';

const punchoutReducers: ActionReducerMap<PunchoutState> = {
  ociConfiguration: ociConfigurationReducer,
  punchoutUsers: punchoutUsersReducer,
  punchoutTypes: punchoutTypesReducer,
  cxmlConfiguration: cxmlConfigurationReducer,
};

const punchoutEffects = [
  OciConfigurationEffects,
  PunchoutUsersEffects,
  PunchoutFunctionsEffects,
  PunchoutTypesEffects,
  CxmlConfigurationEffects,
];

@Injectable()
export class PunchoutStoreConfig implements StoreConfig<PunchoutState> {
  metaReducers = [resetOnLogoutMeta];
}

export const PUNCHOUT_STORE_CONFIG = new InjectionToken<StoreConfig<PunchoutState>>('punchoutStoreConfig');

@NgModule({
  imports: [
    EffectsModule.forFeature(punchoutEffects),
    StoreModule.forFeature('punchout', punchoutReducers, PUNCHOUT_STORE_CONFIG),
  ],
  providers: [{ provide: PUNCHOUT_STORE_CONFIG, useClass: PunchoutStoreConfig }],
})
export class PunchoutStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<PunchoutState>)[]) {
    return StoreModule.forFeature('punchout', pick(punchoutReducers, reducers));
  }
}
