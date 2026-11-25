import { createReducer, on } from '@ngrx/store';

import { AiSearchConfig } from '../../models/ai-search-config/ai-search-config.model';

import { aiSearchConfigInternalActions } from './ai-search-config.actions';

export const aiSearchConfigReducer = createReducer<AiSearchConfig>(
  undefined,
  on(aiSearchConfigInternalActions.setConfig, (_, action): AiSearchConfig => action.payload.config)
);
