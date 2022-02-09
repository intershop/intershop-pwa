import { Injectable, InjectionToken, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreConfig, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { resetOnLogoutMeta } from 'ish-core/utils/meta-reducers';

import { RequisitionManagementState } from './requisition-management-store';
import { RequisitionsEffects } from './requisitions/requisitions.effects';
import { requisitionsReducer } from './requisitions/requisitions.reducer';

const requisitionManagementReducers: ActionReducerMap<RequisitionManagementState> = {
  requisitions: requisitionsReducer,
};

const requisitionManagementEffects = [RequisitionsEffects];

@Injectable()
export class RequisitionManagementStoreConfig implements StoreConfig<RequisitionManagementState> {
  metaReducers = [resetOnLogoutMeta];
}

export const REQUISITION_MANAGEMENT_STORE_CONFIG = new InjectionToken<StoreConfig<RequisitionManagementState>>(
  'requisitionManagementStoreConfig'
);

@NgModule({
  imports: [
    EffectsModule.forFeature(requisitionManagementEffects),
    StoreModule.forFeature('requisitionManagement', requisitionManagementReducers, REQUISITION_MANAGEMENT_STORE_CONFIG),
  ],
  providers: [{ provide: REQUISITION_MANAGEMENT_STORE_CONFIG, useClass: RequisitionManagementStoreConfig }],
})
export class RequisitionManagementStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<RequisitionManagementState>)[]) {
    return StoreModule.forFeature('requisitionManagement', pick(requisitionManagementReducers, reducers));
  }
}
