import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { resetOnLogoutMeta } from 'ish-core/utils/meta-reducers';

import { PunchoutState } from './punchout-store';
import { PunchoutUsersEffects } from './punchout-users/punchout-users.effects';
import { punchoutUsersReducer } from './punchout-users/punchout-users.reducer';

const punchoutReducers: ActionReducerMap<PunchoutState> = { punchoutUsers: punchoutUsersReducer };

const punchoutEffects = [PunchoutUsersEffects];

const metaReducers = [resetOnLogoutMeta];

// not-dead-code
@NgModule({
  imports: [
    EffectsModule.forFeature(punchoutEffects),
    StoreModule.forFeature('punchout', punchoutReducers, { metaReducers }),
  ],
})
export class PunchoutStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<PunchoutState>)[]) {
    return StoreModule.forFeature('punchout', pick(punchoutReducers, reducers));
  }
}
