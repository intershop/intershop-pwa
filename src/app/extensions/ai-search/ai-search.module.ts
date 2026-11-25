import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { AiSearchAnswerBoxComponent } from './shared/ai-search-answer-box/ai-search-answer-box.component';
import { AiSearchNoResultsComponent } from './shared/ai-search-no-results/ai-search-no-results.component';

@NgModule({
  imports: [SharedModule],
  declarations: [AiSearchAnswerBoxComponent, AiSearchNoResultsComponent],
  exports: [SharedModule],
})
export class AiSearchModule {}
