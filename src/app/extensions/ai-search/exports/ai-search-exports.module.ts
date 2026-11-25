import { NgModule } from '@angular/core';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { LAZY_FEATURE_MODULE } from 'ish-core/utils/module-loader/module-loader.service';

import { LazyAiSearchAnswerBoxComponent } from './lazy-ai-search-answer-box/lazy-ai-search-answer-box.component';
import { LazyAiSearchNoResultsComponent } from './lazy-ai-search-no-results/lazy-ai-search-no-results.component';

@NgModule({
  imports: [FeatureToggleModule],
  declarations: [LazyAiSearchAnswerBoxComponent, LazyAiSearchNoResultsComponent],
  providers: [
    {
      provide: LAZY_FEATURE_MODULE,
      useValue: {
        feature: 'aiSearch',
        location: () => import('../store/ai-search-store.module').then(m => m.AiSearchStoreModule),
      },
      multi: true,
    },
  ],
  exports: [LazyAiSearchAnswerBoxComponent, LazyAiSearchNoResultsComponent],
})
export class AiSearchExportsModule {}
