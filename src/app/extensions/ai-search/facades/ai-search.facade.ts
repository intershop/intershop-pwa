import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { AiSearchAnswer } from '../models/ai-search-answer/ai-search-answer.model';
import { AiSearchConfig } from '../models/ai-search-config/ai-search-config.model';
import { aiSearchAnswerActions } from '../store/ai-search-answer/ai-search-answer.actions';
import { AiSearchAnswerState } from '../store/ai-search-answer/ai-search-answer.reducer';
import { getAiSearchAnswerState } from '../store/ai-search-answer/ai-search-answer.selectors';
import { getAiSearchConfig } from '../store/ai-search-config/ai-search-config.selectors';

@Injectable({ providedIn: 'root' })
export class AiSearchFacade {
  constructor(private store: Store) {}

  configuration$: Observable<AiSearchConfig> = this.store.pipe(select(getAiSearchConfig));

  /**
   * The state of the AI answer to a search query: loading while it is generated, with the AI answer once it arrived.
   * Emits `undefined` when the search query has no AI answer.
   *
   * @param searchQuery The search query of the search results page.
   */
  answer$(searchQuery: string): Observable<Pick<AiSearchAnswerState, 'answer' | 'loading'>> {
    return this.store.pipe(
      select(getAiSearchAnswerState),
      map(state =>
        state?.searchQuery === searchQuery && (state.loading || state.answer)
          ? { loading: state.loading, answer: state.answer }
          : undefined
      ),
      distinctUntilChanged((a, b) => a?.loading === b?.loading && a?.answer === b?.answer)
    );
  }

  /**
   * Keeps the AI answer shown to the buyer for the browser tab.
   */
  keepAnswer(answer: AiSearchAnswer) {
    this.store.dispatch(aiSearchAnswerActions.keepAnswer({ answer }));
  }
}
