import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { OrganizationManagementState } from './organization-management-store';
import { UsersEffects } from './users/users.effects';
import { usersReducer } from './users/users.reducer';

const organizationManagementReducers: ActionReducerMap<OrganizationManagementState> = { users: usersReducer };

const organizationManagementEffects = [UsersEffects];

// not-dead-code
@NgModule({
  imports: [
    EffectsModule.forFeature(organizationManagementEffects),
    StoreModule.forFeature('organizationManagement', organizationManagementReducers),
  ],
})
export class OrganizationManagementStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<OrganizationManagementState>)[]) {
    return StoreModule.forFeature('organizationManagement', pick(organizationManagementReducers, reducers));
  }
}
