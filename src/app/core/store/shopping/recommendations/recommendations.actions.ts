import { createActionGroup } from '@ngrx/store';

import { Recommendations, RecommendationsParams } from 'ish-core/models/recommendations/recommendations.model';
import { httpError, payload } from 'ish-core/utils/ngrx-creators';

export const recommendationsActions = createActionGroup({
  source: 'Recommendations',
  events: {
    'Load Product Recommendations': payload<{ recommendationsParams: RecommendationsParams }>(),
    'Load Product Recommendations Fail': httpError<{}>(),
    'Load Product Recommendations Success': payload<{ recommendations: Recommendations }>(),
  },
});
