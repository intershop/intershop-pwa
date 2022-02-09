import { Injectable, InjectionToken, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreConfig, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { resetOnLogoutMeta } from 'ish-core/utils/meta-reducers';

import { ContentState } from './content-store';
import { IncludesEffects } from './includes/includes.effects';
import { includesReducer } from './includes/includes.reducer';
import { PageTreeEffects } from './page-tree/page-tree.effects';
import { pageTreeReducer } from './page-tree/page-tree.reducer';
import { pageletsReducer } from './pagelets/pagelets.reducer';
import { PagesEffects } from './pages/pages.effects';
import { pagesReducer } from './pages/pages.reducer';
import { ParametersEffects } from './parameters/parameters.effects';
import { parametersReducer } from './parameters/parameters.reducer';
import { ViewcontextsEffects } from './viewcontexts/viewcontexts.effects';
import { viewcontextsReducer } from './viewcontexts/viewcontexts.reducer';

const contentReducers: ActionReducerMap<ContentState> = {
  includes: includesReducer,
  pagelets: pageletsReducer,
  pages: pagesReducer,
  viewcontexts: viewcontextsReducer,
  pagetree: pageTreeReducer,
  parameters: parametersReducer,
};

const contentEffects = [IncludesEffects, PagesEffects, ViewcontextsEffects, PageTreeEffects, ParametersEffects];

@Injectable()
export class ContentStoreConfig implements StoreConfig<ContentState> {
  metaReducers = [resetOnLogoutMeta];
}

export const CONTENT_STORE_CONFIG = new InjectionToken<StoreConfig<ContentState>>('contentStoreConfig');

@NgModule({
  imports: [
    EffectsModule.forFeature(contentEffects),
    StoreModule.forFeature('content', contentReducers, CONTENT_STORE_CONFIG),
  ],
  providers: [{ provide: CONTENT_STORE_CONFIG, useClass: ContentStoreConfig }],
})
export class ContentStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<ContentState>)[]) {
    return StoreModule.forFeature('content', pick(contentReducers, reducers));
  }
}
