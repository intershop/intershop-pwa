import { TestBed } from '@angular/core/testing';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { resetUserData } from 'ish-core/store/customer/user';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { CopilotEmbeddedChat } from '../../models/copilot-embedded-chat/copilot-embedded-chat.model';
import { CopilotEmbeddedStoreModule } from '../copilot-embedded-store.module';

import { copilotEmbeddedChatActions } from './copilot-embedded-chat.actions';
import { getCopilotEmbeddedChat } from './copilot-embedded-chat.selectors';

describe('Copilot Embedded Chat Selectors', () => {
  let store$: StoreWithSnapshots;

  const chat: CopilotEmbeddedChat = {
    chatflowid: 'flow-1',
    sessionId: 'session-1',
    chatId: 'chat-1',
    messages: [{ message: 'Hello', type: 'userMessage' }],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CopilotEmbeddedStoreModule.forTesting('_chat'), CoreStoreModule.forTesting()],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  it('should contain an empty chat in the initial state', () => {
    expect(getCopilotEmbeddedChat(store$.state).messages).toBeEmpty();
  });

  describe('after setting the chat', () => {
    beforeEach(() => {
      store$.dispatch(copilotEmbeddedChatActions.setCopilotEmbeddedChat({ chat }));
    });

    it('should select the chat', () => {
      expect(getCopilotEmbeddedChat(store$.state)).toEqual(chat);
    });

    it('should clear the chat when it is reset', () => {
      store$.dispatch(copilotEmbeddedChatActions.resetCopilotEmbeddedChat());

      expect(getCopilotEmbeddedChat(store$.state).messages).toBeEmpty();
    });

    it('should clear the chat when the user data is reset on logout', () => {
      store$.dispatch(resetUserData());

      expect(getCopilotEmbeddedChat(store$.state).messages).toBeEmpty();
    });
  });
});
