import { ChangeDetectionStrategy, Component } from '@angular/core';

import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

/**
 * Integrates AI Search into the no-results page: points the buyer to the AI Product Advisor when the shop operator
 * offers it. The pending AI answer of the search query is discarded by the search result, see `AiSearchAnswerEffects`.
 *
 * @example
 * <ish-ai-search-no-results />
 */
@Component({
  selector: 'ish-ai-search-no-results',
  standalone: false,
  templateUrl: './ai-search-no-results.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@GenerateLazyComponent()
export class AiSearchNoResultsComponent {}
