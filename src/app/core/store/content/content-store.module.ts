import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';

import { ContentState } from './content-store';
import { IncludesEffects } from './includes/includes.effects';
import { includesReducer } from './includes/includes.reducer';
import { pageletsReducer } from './pagelets/pagelets.reducer';
import { PagesEffects } from './pages/pages.effects';
import { pagesReducer } from './pages/pages.reducer';

export const contentReducers: ActionReducerMap<ContentState> = {
  includes: includesReducer,
  pagelets: pageletsReducer,
  pages: pagesReducer,
};

export const contentEffects = [IncludesEffects, PagesEffects];

@NgModule({
  imports: [EffectsModule.forFeature(contentEffects), StoreModule.forFeature('content', contentReducers)],
})
export class ContentStoreModule {}
