import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { CopilotEmbeddedConfigEffects } from './copilot-embedded-config/copilot-embedded-config.effects';
import { copilotEmbeddedConfigReducer } from './copilot-embedded-config/copilot-embedded-config.reducer';
import { CopilotEmbeddedState } from './copilot-embedded-store';

const copilotEmbeddedReducers: ActionReducerMap<CopilotEmbeddedState> = {
  copilotEmbeddedConfig: copilotEmbeddedConfigReducer,
};

const copilotEmbeddedEffects = [CopilotEmbeddedConfigEffects];

@NgModule({
  imports: [
    EffectsModule.forFeature(copilotEmbeddedEffects),
    StoreModule.forFeature('copilotEmbedded', copilotEmbeddedReducers),
  ],
})
export class CopilotEmbeddedStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<CopilotEmbeddedState>)[]) {
    return StoreModule.forFeature('copilotEmbedded', pick(copilotEmbeddedReducers, reducers));
  }
}
