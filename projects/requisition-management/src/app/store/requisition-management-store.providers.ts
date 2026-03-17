import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { ActionReducerMap, StoreConfig, StoreModule, provideState } from '@ngrx/store';
import { pick } from 'lodash-es';

import { resetOnLogoutMeta } from 'ish-core/utils/meta-reducers';

import { RequisitionManagementState } from './requisition-management-store';
import { RequisitionsEffects } from './requisitions/requisitions.effects';
import { requisitionsReducer } from './requisitions/requisitions.reducer';

const requisitionManagementReducers: ActionReducerMap<RequisitionManagementState> = {
  requisitions: requisitionsReducer,
};

const requisitionManagementFeature = 'requisitionManagement';

const requisitionManagementEffects = [RequisitionsEffects];

const requisitionManagementStoreConfig: StoreConfig<RequisitionManagementState> = {
  metaReducers: [resetOnLogoutMeta],
};

export function provideRequisitionManagementStore(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideState(requisitionManagementFeature, requisitionManagementReducers, requisitionManagementStoreConfig),
    provideEffects(requisitionManagementEffects),
  ]);
}

export class RequisitionManagementStoreProviders {
  static forTesting(...reducers: (keyof ActionReducerMap<RequisitionManagementState>)[]) {
    return StoreModule.forFeature(requisitionManagementFeature, pick(requisitionManagementReducers, reducers));
  }
}
