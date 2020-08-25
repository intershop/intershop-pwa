import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { resetOnLogoutMeta } from 'ish-core/utils/meta-reducers';

import { OrganizationHierarchiesEffects } from './organization-hierarchies/organization-hierarchies.effects';
import { organizationHierarchiesReducer } from './organization-hierarchies/organization-hierarchies.reducer';
import { OrganizationManagementState } from './organization-management-store';
import { UsersEffects } from './users/users.effects';
import { usersReducer } from './users/users.reducer';

const organizationManagementReducers: ActionReducerMap<OrganizationManagementState> = {
  users: usersReducer,
  organizationHierarchies: organizationHierarchiesReducer,
};

const organizationManagementEffects = [UsersEffects, OrganizationHierarchiesEffects];

const metaReducers = [resetOnLogoutMeta];

@NgModule({
  imports: [
    EffectsModule.forFeature(organizationManagementEffects),
    StoreModule.forFeature('organizationManagement', organizationManagementReducers, { metaReducers }),
  ],
})
export class OrganizationManagementStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<OrganizationManagementState>)[]) {
    return StoreModule.forFeature('organizationManagement', pick(organizationManagementReducers, reducers), {
      metaReducers,
    });
  }
}
