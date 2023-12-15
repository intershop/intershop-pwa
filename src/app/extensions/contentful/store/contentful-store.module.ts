import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { ContentfulState } from './contentful-store';

const contentfulReducers: ActionReducerMap<ContentfulState> = {};

const contentfulEffects = [];

@NgModule({
  imports: [EffectsModule.forFeature(contentfulEffects), StoreModule.forFeature('contentful', contentfulReducers)],
})
export class ContentfulStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<ContentfulState>)[]) {
    return StoreModule.forFeature('contentful', pick(contentfulReducers, reducers));
  }
}
