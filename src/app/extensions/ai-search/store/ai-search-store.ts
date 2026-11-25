import { createFeatureSelector } from '@ngrx/store';

import { AiSearchAnswer } from '../models/ai-search-answer/ai-search-answer.model';
import { AiSearchConfig } from '../models/ai-search-config/ai-search-config.model';

import { AiSearchAnswerState } from './ai-search-answer/ai-search-answer.reducer';

export interface AiSearchState {
  aiSearchConfig: AiSearchConfig;
  aiSearchAnswer: AiSearchAnswerState;
  _keptAnswer: AiSearchAnswer;
}

export const getAiSearchState = createFeatureSelector<AiSearchState>('aiSearch');
