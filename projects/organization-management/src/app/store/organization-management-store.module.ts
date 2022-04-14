import { Injectable, InjectionToken, NgModule } from '@angular/core';
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

const organizationManagementEffects = [UsersEffects, CostCentersEffects, BudgetEffects];

@Injectable()
export class DefaultOrganizationManagementStoreConfig implements StoreConfig<OrganizationManagementState> {
  metaReducers = [resetOnLogoutMeta];
}

export const ORGANIZATION_MANAGEMENT_STORE_CONFIG = new InjectionToken<StoreConfig<OrganizationManagementState>>(
  'organizationManagementStoreConfig'
);

@NgModule({
  imports: [
    EffectsModule.forFeature(organizationManagementEffects),
    StoreModule.forFeature(
      'organizationManagement',
      organizationManagementReducers,
      ORGANIZATION_MANAGEMENT_STORE_CONFIG
    ),
  ],
  providers: [{ provide: ORGANIZATION_MANAGEMENT_STORE_CONFIG, useClass: DefaultOrganizationManagementStoreConfig }],
})
export class OrganizationManagementStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<OrganizationManagementState>)[]) {
    return StoreModule.forFeature('organizationManagement', pick(organizationManagementReducers, reducers));
  }
}
