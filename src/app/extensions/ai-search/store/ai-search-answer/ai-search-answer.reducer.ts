import { createReducer, on } from '@ngrx/store';

import { resetUserData } from 'ish-core/store/customer/user';

import { AiSearchAnswer } from '../../models/ai-search-answer/ai-search-answer.model';

import { aiSearchAnswerActions, aiSearchAnswerInternalActions } from './ai-search-answer.actions';

/**
 * The AI answer of the search query of the current search results page.
 */
export interface AiSearchAnswerState {
  searchQuery: string;
  loading: boolean;
  answer: AiSearchAnswer;
}

const initialState: AiSearchAnswerState = {
  searchQuery: undefined,
  loading: false,
  answer: undefined,
};

export const aiSearchAnswerReducer = createReducer(
  initialState,
  on(aiSearchAnswerInternalActions.loadAnswer, (_, action): AiSearchAnswerState => ({
    searchQuery: action.payload.searchQuery,
    loading: true,
    answer: undefined,
  })),
  // an AI answer of a previous search query arrives late and is not shown (A4)
  on(aiSearchAnswerInternalActions.loadAnswerSuccess, (state, action): AiSearchAnswerState => {
    const { answer } = action.payload;
    return state.loading && state.searchQuery === answer.searchQuery ? { ...state, loading: false, answer } : state;
  }),
  on(aiSearchAnswerInternalActions.loadAnswerFail, (state, action): AiSearchAnswerState =>
    state.searchQuery === action.payload.searchQuery ? { ...state, loading: false, answer: undefined } : state
  ),
  on(aiSearchAnswerInternalActions.showKeptAnswer, (_, action): AiSearchAnswerState => ({
    searchQuery: action.payload.answer.searchQuery,
    loading: false,
    answer: action.payload.answer,
  })),
  // a search without products discards the pending AI answer of its search query (A1)
  on(aiSearchAnswerInternalActions.discardAnswer, (state, action): AiSearchAnswerState =>
    state.searchQuery === action.payload.searchQuery ? initialState : state
  ),
  on(aiSearchAnswerInternalActions.resetAnswer, (): AiSearchAnswerState => initialState)
);

const initialKeptAnswer: AiSearchAnswer = {
  searchQuery: undefined,
  text: undefined,
};

/**
 * The last AI answer shown to the buyer, stored by `dataRetention.aiSearch`.
 */
// UC-001 BR-013: Only the last shown AI answer is kept; logout deletes it.
export const aiSearchKeptAnswerReducer = createReducer(
  initialKeptAnswer,
  on(aiSearchAnswerActions.keepAnswer, (_, action): AiSearchAnswer => action.payload.answer),
  on(resetUserData, (): AiSearchAnswer => initialKeptAnswer)
);
