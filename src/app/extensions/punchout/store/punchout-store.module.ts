import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { OciPunchoutEffects } from './oci-punchout/oci-punchout.effects';
import { ociPunchoutReducer } from './oci-punchout/oci-punchout.reducer';
import { PunchoutState } from './punchout-store';

const punchoutReducers: ActionReducerMap<PunchoutState> = { ociPunchout: ociPunchoutReducer };

const punchoutEffects = [OciPunchoutEffects];

// not-dead-code
@NgModule({
  imports: [EffectsModule.forFeature(punchoutEffects), StoreModule.forFeature('punchout', punchoutReducers)],
})
export class PunchoutStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<PunchoutState>)[]) {
    return StoreModule.forFeature('punchout', pick(punchoutReducers, reducers));
  }
}
