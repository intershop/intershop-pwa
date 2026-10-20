import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';

import { resetUserData } from 'ish-core/store/customer/user';

import { CopilotEmbeddedChatEffects } from './copilot-embedded-chat.effects';

describe('Copilot Embedded Chat Effects', () => {
  let actions$: Observable<Action>;
  let effects: CopilotEmbeddedChatEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CopilotEmbeddedChatEffects, provideMockActions(() => actions$)],
    });

    effects = TestBed.inject(CopilotEmbeddedChatEffects);
    localStorage.clear();
  });

  afterEach(() => localStorage.clear());

  describe('removePersistedChatsOnLogout$', () => {
    it('should remove all persisted chats but keep other entries when the user data is reset', done => {
      localStorage.setItem('copilot_embedded_chat_flow-1', '{}');
      localStorage.setItem('copilot_embedded_chat_flow-2', '{}');
      localStorage.setItem('_searchTerms', '[]');
      actions$ = of(resetUserData());

      effects.removePersistedChatsOnLogout$.subscribe(() => {
        expect(localStorage.getItem('copilot_embedded_chat_flow-1')).toBeNull();
        expect(localStorage.getItem('copilot_embedded_chat_flow-2')).toBeNull();
        expect(localStorage.getItem('_searchTerms')).toBe('[]');
        done();
      });
    });
  });
});
