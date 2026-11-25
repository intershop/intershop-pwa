import { APP_BASE_HREF } from '@angular/common';
import { Inject, Injectable, InjectionToken, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreConfig, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { dataRetentionMeta } from 'ish-core/utils/meta-reducers';

import { AiSearchAnswerEffects } from './ai-search-answer/ai-search-answer.effects';
import { aiSearchAnswerReducer, aiSearchKeptAnswerReducer } from './ai-search-answer/ai-search-answer.reducer';
import { AiSearchConfigEffects } from './ai-search-config/ai-search-config.effects';
import { aiSearchConfigReducer } from './ai-search-config/ai-search-config.reducer';
import { AiSearchState } from './ai-search-store';

const aiSearchReducers: ActionReducerMap<AiSearchState> = {
  aiSearchConfig: aiSearchConfigReducer,
  aiSearchAnswer: aiSearchAnswerReducer,
  _keptAnswer: aiSearchKeptAnswerReducer,
};

const aiSearchEffects = [AiSearchAnswerEffects, AiSearchConfigEffects];

@Injectable()
export class DefaultAiSearchStoreConfig implements StoreConfig<AiSearchState> {
  // UC-001 BR-013: The kept AI answer lives in the session storage of the browser tab.
  metaReducers = [dataRetentionMeta<AiSearchState>('session', this.appBaseHref, 'aiSearch', '_keptAnswer')];

  constructor(@Inject(APP_BASE_HREF) private appBaseHref: string) {}
}

export const AI_SEARCH_STORE_CONFIG = new InjectionToken<StoreConfig<AiSearchState>>('aiSearchStoreConfig');

@NgModule({
  imports: [
    EffectsModule.forFeature(aiSearchEffects),
    StoreModule.forFeature('aiSearch', aiSearchReducers, AI_SEARCH_STORE_CONFIG),
  ],
  providers: [{ provide: AI_SEARCH_STORE_CONFIG, useClass: DefaultAiSearchStoreConfig }],
})
export class AiSearchStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<AiSearchState>)[]) {
    return StoreModule.forFeature('aiSearch', pick(aiSearchReducers, reducers));
  }
}
