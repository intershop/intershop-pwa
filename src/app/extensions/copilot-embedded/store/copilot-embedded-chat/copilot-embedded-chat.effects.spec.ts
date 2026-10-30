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
    sessionStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('removePersistedChatsOnLogout$', () => {
    it('should remove the persisted chats of all base hrefs but keep other entries on logout', done => {
      localStorage.setItem('/en-copilotEmbedded-_chat', '{}');
      localStorage.setItem('/de-copilotEmbedded-_chat', '{}');
      sessionStorage.setItem('/fr-copilotEmbedded-_chat', '{}');
      localStorage.setItem('/en-recently-_recently', '[]');
      actions$ = of(resetUserData());

      effects.removePersistedChatsOnLogout$.subscribe(() => {
        expect(localStorage.getItem('/en-copilotEmbedded-_chat')).toBeNull();
        expect(localStorage.getItem('/de-copilotEmbedded-_chat')).toBeNull();
        expect(sessionStorage.getItem('/fr-copilotEmbedded-_chat')).toBeNull();
        expect(localStorage.getItem('/en-recently-_recently')).toBe('[]');
        done();
      });
    });
  });
});
