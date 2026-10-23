import { APP_BASE_HREF } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { EMPTY } from 'rxjs';
import { anything, instance, mock, when } from 'ts-mockito';

import { DATA_RETENTION_POLICY } from 'ish-core/configurations/injection-keys';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { resetUserData } from 'ish-core/store/customer/user';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';
import { StatePropertiesService } from 'ish-core/utils/state-transfer/state-properties.service';

import { CopilotEmbeddedChat } from '../../models/copilot-embedded-chat/copilot-embedded-chat.model';
import { CopilotEmbeddedStoreModule } from '../copilot-embedded-store.module';

import { copilotEmbeddedChatActions } from './copilot-embedded-chat.actions';

const STORAGE_KEY = '/-copilotEmbedded-_chat';

describe('Copilot Embedded Chat Integration', () => {
  let store$: StoreWithSnapshots;

  const chat: CopilotEmbeddedChat = {
    chatflowid: 'flow-1',
    sessionId: 'session-1',
    chatId: 'chat-1',
    messages: [{ message: 'Hello', type: 'userMessage' }],
  };

  function storedChat(): CopilotEmbeddedChat {
    return JSON.parse(localStorage.getItem(STORAGE_KEY))?.data;
  }

  beforeEach(() => {
    localStorage.clear();
    const statePropertiesService = mock(StatePropertiesService);
    when(statePropertiesService.getStateOrEnvOrDefault(anything(), anything())).thenReturn(EMPTY);

    TestBed.configureTestingModule({
      imports: [CopilotEmbeddedStoreModule, CoreStoreModule.forTesting([], true)],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: DATA_RETENTION_POLICY, useValue: { copilotEmbedded: 60 } },
        { provide: StatePropertiesService, useFactory: () => instance(statePropertiesService) },
        provideStoreSnapshots(),
      ],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  afterEach(() => localStorage.clear());

  it('should persist the chat in the localStorage', () => {
    store$.dispatch(copilotEmbeddedChatActions.setCopilotEmbeddedChat({ chat }));

    expect(storedChat()).toEqual(chat);
  });

  it('should clear the persisted chat on logout', () => {
    store$.dispatch(copilotEmbeddedChatActions.setCopilotEmbeddedChat({ chat }));
    store$.dispatch(resetUserData());

    expect(storedChat().messages).toBeEmpty();
  });
});
