import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { ActionReducerMap, StoreModule, provideState } from '@ngrx/store';
import { pick } from 'lodash-es';

import { CopilotConfigEffects } from './copilot-config/copilot-config.effects';
import { copilotConfigReducer } from './copilot-config/copilot-config.reducer';
import { CopilotState } from './copilot-store';

const copilotReducers: ActionReducerMap<CopilotState> = {
  copilotConfig: copilotConfigReducer,
};

const copilotEffects = [CopilotConfigEffects];

export function provideCopilotStore(): EnvironmentProviders {
  return makeEnvironmentProviders([provideState('copilot', copilotReducers), provideEffects(copilotEffects)]);
}

export class CopilotStoreProviders {
  static forTesting(...reducers: (keyof ActionReducerMap<CopilotState>)[]) {
    return StoreModule.forFeature('copilot', pick(copilotReducers, reducers));
  }
}
