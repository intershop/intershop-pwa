import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';
import { Observable, of, throwError } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';

import { CopilotEmbeddedFacade } from '../../facades/copilot-embedded.facade';
import { CopilotEmbeddedChatMessage } from '../../models/copilot-embedded/copilot-embedded.model';

import { CopilotEmbeddedChatComponent } from './copilot-embedded-chat/copilot-embedded-chat.component';
import { CopilotEmbeddedHeaderComponent } from './copilot-embedded-header/copilot-embedded-header.component';
import { CopilotEmbeddedPageComponent } from './copilot-embedded-page.component';
import { CopilotEmbeddedResultsComponent } from './copilot-embedded-results/copilot-embedded-results.component';

describe('Copilot Embedded Page Component', () => {
  let fixture: ComponentFixture<CopilotEmbeddedPageComponent>;
  let component: CopilotEmbeddedPageComponent;
  let facade: {
    configuration$: Observable<{ chatflowid: string; streaming?: boolean }>;
    isStreamingAvailable$: jest.Mock;
    sendMessage: jest.Mock;
    streamMessage: jest.Mock;
    handleToolCalls: jest.Mock;
  };

  function createPage() {
    fixture = TestBed.createComponent(CopilotEmbeddedPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  beforeEach(async () => {
    localStorage.clear();
    facade = {
      configuration$: of({ chatflowid: 'flow-1', streaming: false }),
      isStreamingAvailable$: jest.fn(() => of(false)),
      sendMessage: jest.fn(() => of({ text: 'A recommendation', chatId: 'chat-1' })),
      streamMessage: jest.fn(() => of({ event: 'token', data: 'A streamed answer' })),
      handleToolCalls: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [NgbNavModule],
      declarations: [
        CopilotEmbeddedPageComponent,
        MockComponent(CopilotEmbeddedChatComponent),
        MockComponent(CopilotEmbeddedHeaderComponent),
        MockComponent(CopilotEmbeddedResultsComponent),
        MockPipe(TranslatePipe),
      ],
      providers: [
        { provide: AppFacade, useValue: { deviceType$: of('desktop') } },
        { provide: CopilotEmbeddedFacade, useValue: facade },
        { provide: TranslateService, useValue: { instant: (key: string) => key } },
      ],
    }).compileComponents();
  });

  afterEach(() => localStorage.clear());

  it('should be created', () => {
    createPage();

    expect(component).toBeTruthy();
    expect(fixture.nativeElement).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should use the non-streaming request when streaming is disabled in configuration', () => {
    createPage();

    component.onSend({ question: '  find laptops  ' });

    expect(facade.isStreamingAvailable$).not.toHaveBeenCalled();
    expect(facade.streamMessage).not.toHaveBeenCalled();
    expect(facade.sendMessage).toHaveBeenCalledWith('find laptops', {
      sessionId: expect.any(String),
      chatId: undefined,
      uploads: undefined,
    });
    expect(component.messages.map(message => message.message)).toEqual(['find laptops', 'A recommendation']);
    expect(component.loading).toBeFalse();
  });

  it('should append streamed tokens and persist the resulting conversation', () => {
    facade.configuration$ = of({ chatflowid: 'flow-1', streaming: true });
    facade.streamMessage.mockReturnValue(
      of(
        { event: 'token', data: 'A ' },
        { event: 'metadata', data: { chatId: 'stream-chat-1' } },
        { event: 'token', data: 'streamed answer' }
      )
    );
    createPage();

    component.onSend({ question: 'recommend something' });

    expect(facade.sendMessage).not.toHaveBeenCalled();
    expect(component.messages.map(message => message.message)).toEqual(['recommend something', 'A streamed answer']);
    expect(component.loading).toBeFalse();
    expect(JSON.parse(localStorage.getItem('copilot_embedded_chat_flow-1')).chatId).toBe('stream-chat-1');
  });

  it('should fetch a complete answer when the stream ends without tokens', () => {
    facade.configuration$ = of({ chatflowid: 'flow-1', streaming: true });
    facade.streamMessage.mockReturnValue(of({ event: 'metadata', data: { chatId: 'stream-chat-2' } }));
    facade.sendMessage.mockReturnValue(of({ text: 'Fallback answer', chatId: 'final-chat-2' }));
    createPage();

    component.onSend({ question: 'show me options' });

    expect(facade.sendMessage).toHaveBeenCalledWith('show me options', {
      sessionId: expect.any(String),
      chatId: 'stream-chat-2',
      uploads: undefined,
    });
    expect(component.messages.at(-1)).toMatchObject({ message: 'Fallback answer', type: 'apiMessage' });
    expect(component.loading).toBeFalse();
  });

  it('should expose a generic error and stop loading when a request fails', () => {
    facade.sendMessage.mockReturnValue(throwError(() => new Error('offline')));
    createPage();

    component.onSend({ question: 'help' });

    expect(component.error).toBe('copilot.embedded.error.generic');
    expect(component.loading).toBeFalse();
    expect(component.messages).toHaveLength(1);
  });

  it('should restore the saved transcript and clear it when the session is reset', () => {
    const history: CopilotEmbeddedChatMessage[] = [{ message: 'Saved reply', type: 'apiMessage' }];
    localStorage.setItem(
      'copilot_embedded_chat_flow-1',
      JSON.stringify({ chatId: 'saved-chat', chatHistory: history })
    );
    createPage();

    expect(component.messages).toEqual(history);

    component.resetSession();

    expect(component.messages).toBeEmpty();
    expect(localStorage.getItem('copilot_embedded_chat_flow-1')).toBeNull();
    expect(localStorage.getItem('copilot_embedded_session_id')).not.toBeNull();
  });

  it('should ignore a malformed saved transcript', () => {
    localStorage.setItem('copilot_embedded_chat_flow-1', '{invalid json');
    createPage();

    expect(component.messages).toBeEmpty();
  });
});
