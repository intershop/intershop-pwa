import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { Recommendations } from 'ish-core/models/recommendations/recommendations.model';
import { setLoadingOn, unsetLoadingAndErrorOn, unsetLoadingOn } from 'ish-core/utils/ngrx-creators';

import { recommendationsActions } from './recommendations.actions';

export const recommendationsAdapter = createEntityAdapter<Recommendations>({
  selectId: recommendation => recommendation.strategy,
});

export type RecommendationsState = EntityState<Recommendations>;

const initialState: RecommendationsState = recommendationsAdapter.getInitialState({});

export const recommendationsReducer = createReducer(
  initialState,
  setLoadingOn(recommendationsActions.loadProductRecommendations),
  unsetLoadingOn(recommendationsActions.loadProductRecommendationsSuccess),
  unsetLoadingAndErrorOn(recommendationsActions.loadProductRecommendationsFail),
  on(recommendationsActions.loadProductRecommendationsSuccess, (state, action) =>
    recommendationsAdapter.upsertOne(action.payload.recommendations, state)
  )
);
