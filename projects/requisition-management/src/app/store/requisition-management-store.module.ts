import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { resetOnLogoutMeta } from 'ish-core/utils/meta-reducers';

import { RequisitionManagementState } from './requisition-management-store';
import { RequisitionsEffects } from './requisitions/requisitions.effects';
import { requisitionsReducer } from './requisitions/requisitions.reducer';

const requisitionManagementReducers: ActionReducerMap<RequisitionManagementState> = {
  requisitions: requisitionsReducer,
};

const requisitionManagementEffects = [RequisitionsEffects];

const metaReducers = [resetOnLogoutMeta];

@NgModule({
  imports: [
    EffectsModule.forFeature(requisitionManagementEffects),
    StoreModule.forFeature('requisitionManagement', requisitionManagementReducers, { metaReducers }),
  ],
})
export class RequisitionManagementStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<RequisitionManagementState>)[]) {
    return StoreModule.forFeature('requisitionManagement', pick(requisitionManagementReducers, reducers), {
      metaReducers,
    });
  }
}
