import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { CompanyStructureState } from './company-structure-store';

const companyStructureReducers: ActionReducerMap<CompanyStructureState> = {};

const companyStructureEffects = [];

// not-dead-code
@NgModule({
  imports: [
    EffectsModule.forFeature(companyStructureEffects),
    StoreModule.forFeature('companyStructure', companyStructureReducers),
  ],
})
export class CompanyStructureStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<CompanyStructureState>)[]) {
    return StoreModule.forFeature('companyStructure', pick(companyStructureReducers, reducers));
  }
}
