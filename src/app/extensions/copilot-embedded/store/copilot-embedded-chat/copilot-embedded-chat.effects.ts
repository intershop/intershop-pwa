import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { filter, map } from 'rxjs/operators';

import { resetUserData } from 'ish-core/store/customer/user';

import { COPILOT_EMBEDDED_CHAT_STORAGE_KEY_PREFIX } from '../../models/copilot-embedded-chat-message/copilot-embedded-chat-message.model';

@Injectable()
export class CopilotEmbeddedChatEffects {
  constructor(private actions$: Actions) {}

  /**
   * Removes the persisted chats on logout, so the next user of the browser cannot see them.
   */
  removePersistedChatsOnLogout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(resetUserData),
        filter(() => !SSR),
        map(() =>
          Array.from({ length: localStorage.length }, (_, index) => localStorage.key(index))
            .filter(key => key?.startsWith(COPILOT_EMBEDDED_CHAT_STORAGE_KEY_PREFIX))
            .forEach(key => localStorage.removeItem(key))
        )
      ),
    { dispatch: false }
  );
}
