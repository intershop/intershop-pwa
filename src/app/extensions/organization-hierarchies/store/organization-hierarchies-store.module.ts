import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { resetOnLogoutMeta } from 'ish-core/utils/meta-reducers';

import { GroupEffects } from './group/group.effects';
import { groupReducer } from './group/group.reducer';
import { OrganizationHierarchiesState } from './organization-hierarchies-store';

const organizationHierarchiesReducers: ActionReducerMap<OrganizationHierarchiesState> = {
  group: groupReducer,
};

const organizationHierarchiesEffects = [GroupEffects];

const metaReducers = [resetOnLogoutMeta];

// not-dead-code
@NgModule({
  imports: [
    EffectsModule.forFeature(organizationHierarchiesEffects),
    StoreModule.forFeature('organizationHierarchies', organizationHierarchiesReducers, { metaReducers }),
  ],
})
export class OrganizationHierarchiesStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<OrganizationHierarchiesState>)[]) {
    return StoreModule.forFeature('organizationHierarchies', pick(organizationHierarchiesReducers, reducers), {
      metaReducers,
    });
  }
}
