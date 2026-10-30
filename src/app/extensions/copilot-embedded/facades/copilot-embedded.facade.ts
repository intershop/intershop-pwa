import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { CopilotEmbeddedChat } from '../models/copilot-embedded-chat/copilot-embedded-chat.model';
import { CopilotEmbeddedConfig } from '../models/copilot-embedded-config/copilot-embedded-config.model';
import { copilotEmbeddedChatActions } from '../store/copilot-embedded-chat/copilot-embedded-chat.actions';
import { getCopilotEmbeddedChat } from '../store/copilot-embedded-chat/copilot-embedded-chat.selectors';
import { getCopilotEmbeddedConfig } from '../store/copilot-embedded-config/copilot-embedded-config.selectors';

@Injectable({ providedIn: 'root' })
export class CopilotEmbeddedFacade {
  constructor(private store: Store) {}

  configuration$: Observable<CopilotEmbeddedConfig> = this.store.pipe(select(getCopilotEmbeddedConfig));

  /** The persisted conversation, restored from the browser storage according to `dataRetention.copilotEmbedded`. */
  chat$: Observable<CopilotEmbeddedChat> = this.store.pipe(select(getCopilotEmbeddedChat));

  setChat(chat: CopilotEmbeddedChat) {
    this.store.dispatch(copilotEmbeddedChatActions.setCopilotEmbeddedChat({ chat }));
  }

  resetChat() {
    this.store.dispatch(copilotEmbeddedChatActions.resetCopilotEmbeddedChat());
  }
}
