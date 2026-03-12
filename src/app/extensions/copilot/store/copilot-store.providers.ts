import { EnvironmentProviders, importProvidersFrom, makeEnvironmentProviders } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { CopilotConfigEffects } from './copilot-config/copilot-config.effects';
import { copilotConfigReducer } from './copilot-config/copilot-config.reducer';
import { CopilotState } from './copilot-store';

const copilotReducers: ActionReducerMap<CopilotState> = {
  copilotConfig: copilotConfigReducer,
};

const copilotEffects = [CopilotConfigEffects];

const copilotStoreImports = [
  EffectsModule.forFeature(copilotEffects),
  StoreModule.forFeature('copilot', copilotReducers),
];

export function provideCopilotStore(): EnvironmentProviders {
  return makeEnvironmentProviders([importProvidersFrom(...copilotStoreImports)]);
}

export class CopilotStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<CopilotState>)[]) {
    return StoreModule.forFeature('copilot', pick(copilotReducers, reducers));
  }
}
