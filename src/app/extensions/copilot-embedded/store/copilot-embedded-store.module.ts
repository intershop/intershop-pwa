import { APP_BASE_HREF } from '@angular/common';
import { Inject, Injectable, InjectionToken, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreConfig, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { DATA_RETENTION_POLICY } from 'ish-core/configurations/injection-keys';
import { InjectSingle } from 'ish-core/utils/injection';
import { dataRetentionMeta } from 'ish-core/utils/meta-reducers';

import { copilotEmbeddedChatReducer } from './copilot-embedded-chat/copilot-embedded-chat.reducer';
import { CopilotEmbeddedConfigEffects } from './copilot-embedded-config/copilot-embedded-config.effects';
import { copilotEmbeddedConfigReducer } from './copilot-embedded-config/copilot-embedded-config.reducer';
import { CopilotEmbeddedState } from './copilot-embedded-store';

const copilotEmbeddedReducers: ActionReducerMap<CopilotEmbeddedState> = {
  copilotEmbeddedConfig: copilotEmbeddedConfigReducer,
  _chat: copilotEmbeddedChatReducer,
};

const copilotEmbeddedEffects = [CopilotEmbeddedConfigEffects];

@Injectable()
export class DefaultCopilotEmbeddedStoreConfig implements StoreConfig<CopilotEmbeddedState> {
  metaReducers = [
    dataRetentionMeta<CopilotEmbeddedState>(
      this.dataRetention.copilotEmbedded,
      this.appBaseHref,
      'copilotEmbedded',
      '_chat'
    ),
  ];

  constructor(
    @Inject(APP_BASE_HREF) private appBaseHref: string,
    @Inject(DATA_RETENTION_POLICY) private dataRetention: InjectSingle<typeof DATA_RETENTION_POLICY>
  ) {}
}

export const COPILOT_EMBEDDED_STORE_CONFIG = new InjectionToken<StoreConfig<CopilotEmbeddedState>>(
  'copilotEmbeddedStoreConfig'
);

@NgModule({
  imports: [
    EffectsModule.forFeature(copilotEmbeddedEffects),
    StoreModule.forFeature('copilotEmbedded', copilotEmbeddedReducers, COPILOT_EMBEDDED_STORE_CONFIG),
  ],
  providers: [{ provide: COPILOT_EMBEDDED_STORE_CONFIG, useClass: DefaultCopilotEmbeddedStoreConfig }],
})
export class CopilotEmbeddedStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<CopilotEmbeddedState>)[]) {
    return StoreModule.forFeature('copilotEmbedded', pick(copilotEmbeddedReducers, reducers));
  }
}
