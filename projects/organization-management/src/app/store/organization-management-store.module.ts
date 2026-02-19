import { EnvironmentProviders, NgModule, importProvidersFrom } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreConfig, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { resetOnLogoutMeta } from 'ish-core/utils/meta-reducers';

import { BudgetEffects } from './budget/budget.effects';
import { budgetReducer } from './budget/budget.reducer';
import { CostCentersEffects } from './cost-centers/cost-centers.effects';
import { costCentersReducer } from './cost-centers/cost-centers.reducer';
import { OrganizationManagementState } from './organization-management-store';
import { UsersEffects } from './users/users.effects';
import { usersReducer } from './users/users.reducer';

const organizationManagementReducers: ActionReducerMap<OrganizationManagementState> = {
  users: usersReducer,
  costCenters: costCentersReducer,
  budget: budgetReducer,
};

const organizationManagementFeature = 'organizationManagement';

const organizationManagementEffects = [UsersEffects, CostCentersEffects, BudgetEffects];

const organizationManagementStoreConfig: StoreConfig<OrganizationManagementState> = {
  metaReducers: [resetOnLogoutMeta],
};

export function provideOrganizationManagementStore(): EnvironmentProviders {
  return importProvidersFrom(
    StoreModule.forFeature(
      organizationManagementFeature,
      organizationManagementReducers,
      organizationManagementStoreConfig
    ),
    EffectsModule.forFeature(organizationManagementEffects)
  );
}

@NgModule({
  providers: [provideOrganizationManagementStore()],
})
export class OrganizationManagementStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<OrganizationManagementState>)[]) {
    return StoreModule.forFeature(organizationManagementFeature, pick(organizationManagementReducers, reducers));
  }
}
