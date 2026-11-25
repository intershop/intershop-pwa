import { createActionGroup, emptyProps } from '@ngrx/store';

import { payload } from 'ish-core/utils/ngrx-creators';

import { AiSearchAnswer } from '../../models/ai-search-answer/ai-search-answer.model';

export const aiSearchAnswerActions = createActionGroup({
  source: 'AI Search Answer',
  events: {
    'Keep Answer': payload<{ answer: AiSearchAnswer }>(),
  },
});

export const aiSearchAnswerInternalActions = createActionGroup({
  source: 'AI Search Answer Internal',
  events: {
    'Load Answer': payload<{ searchQuery: string }>(),
    'Load Answer Success': payload<{ answer: AiSearchAnswer }>(),
    'Load Answer Fail': payload<{ searchQuery: string }>(),
    'Show Kept Answer': payload<{ answer: AiSearchAnswer }>(),
    'Discard Answer': payload<{ searchQuery: string }>(),
    'Reset Answer': emptyProps(),
  },
});
