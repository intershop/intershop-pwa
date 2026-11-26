import { APP_BASE_HREF } from '@angular/common';
import { Inject, Injectable, InjectionToken, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreConfig, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { DATA_RETENTION_POLICY } from 'ish-core/configurations/injection-keys';
import { InjectSingle } from 'ish-core/utils/injection';
import { dataRetentionMeta } from 'ish-core/utils/meta-reducers';

import { AiSearchAnswerEffects } from './ai-search-answer/ai-search-answer.effects';
import { aiSearchAnswerReducer, aiSearchKeptAnswerReducer } from './ai-search-answer/ai-search-answer.reducer';
import { AiSearchConfigEffects } from './ai-search-config/ai-search-config.effects';
import { aiSearchConfigReducer } from './ai-search-config/ai-search-config.reducer';
import { AI_SEARCH_KEPT_ANSWER_STORAGE, AiSearchState } from './ai-search-store';

const aiSearchReducers: ActionReducerMap<AiSearchState> = {
  aiSearchConfig: aiSearchConfigReducer,
  aiSearchAnswer: aiSearchAnswerReducer,
  _keptAnswer: aiSearchKeptAnswerReducer,
};

const aiSearchEffects = [AiSearchAnswerEffects, AiSearchConfigEffects];

@Injectable()
export class DefaultAiSearchStoreConfig implements StoreConfig<AiSearchState> {
  // UC-001 BR-013: The kept AI answer is stored by `dataRetention.aiSearch`, by default for the browser tab.
  metaReducers = [
    dataRetentionMeta<AiSearchState>(
      this.dataRetention.aiSearch,
      this.appBaseHref,
      AI_SEARCH_KEPT_ANSWER_STORAGE.prefix,
      AI_SEARCH_KEPT_ANSWER_STORAGE.key
    ),
  ];

  constructor(
    @Inject(APP_BASE_HREF) private appBaseHref: string,
    @Inject(DATA_RETENTION_POLICY) private dataRetention: InjectSingle<typeof DATA_RETENTION_POLICY>
  ) {}
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
