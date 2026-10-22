import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterModule, provideRouter } from '@angular/router';
import { TranslatePipe, provideTranslateService } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { BehaviorSubject } from 'rxjs';
import { deepEqual, instance, mock, verify, when } from 'ts-mockito';

import { CopilotEmbeddedContext, CopilotEmbeddedContextFacade } from '../../../facades/copilot-embedded-context.facade';
import { CopilotEmbeddedChatMessage } from '../../../models/copilot-embedded-chat-message/copilot-embedded-chat-message.model';
import { CopilotEmbeddedHeaderComponent } from '../copilot-embedded-header/copilot-embedded-header.component';
import { CopilotEmbeddedIconComponent } from '../copilot-embedded-icon/copilot-embedded-icon.component';
import { CopilotEmbeddedInputComponent } from '../copilot-embedded-input/copilot-embedded-input.component';
import { CopilotEmbeddedMessagesComponent } from '../copilot-embedded-messages/copilot-embedded-messages.component';

import { CopilotEmbeddedChatComponent } from './copilot-embedded-chat.component';

describe('Copilot Embedded Chat Component', () => {
  let component: CopilotEmbeddedChatComponent;
  let fixture: ComponentFixture<CopilotEmbeddedChatComponent>;
  let element: HTMLElement;
  let context: CopilotEmbeddedContextFacade;
  let state: CopilotEmbeddedContext;
  let state$: BehaviorSubject<CopilotEmbeddedContext>;

  function botMessage(choices?: CopilotEmbeddedChatMessage['choices']): CopilotEmbeddedChatMessage {
    return { message: 'How do these employees mainly work?', type: 'apiMessage', choices };
  }

  function setState(patch: Partial<CopilotEmbeddedContext>) {
    state = { ...state, ...patch };
    state$.next(state);
    fixture.detectChanges();
  }

  beforeEach(async () => {
    state = {
      chatflowid: 'flow-1',
      sessionId: 'session-1',
      chatId: undefined,
      messages: [],
      pendingAnswer: '',
      loading: false,
      error: undefined,
      toolErrors: [],
      products: [],
    };
    state$ = new BehaviorSubject(state);
    context = mock(CopilotEmbeddedContextFacade);
    when(context.select()).thenReturn(state$);

    await TestBed.configureTestingModule({
      imports: [RouterModule, TranslatePipe],
      declarations: [
        CopilotEmbeddedChatComponent,
        CopilotEmbeddedInputComponent,
        MockComponent(CopilotEmbeddedHeaderComponent),
        MockComponent(CopilotEmbeddedIconComponent),
        MockComponent(CopilotEmbeddedMessagesComponent),
      ],
      providers: [
        { provide: CopilotEmbeddedContextFacade, useFactory: () => instance(context) },
        provideRouter([]),
        provideTranslateService(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CopilotEmbeddedChatComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.deviceType = 'desktop';
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render the error as a localized message', () => {
    setState({ error: 'copilot.embedded.error.generic' });

    expect(element.querySelector('.copilot-embedded-error').textContent.trim()).toBe('copilot.embedded.error.generic');
  });

  it('should announce loading and completed replies without announcing streamed tokens', () => {
    setState({ messages: [{ message: 'Question', type: 'userMessage' }], loading: true });

    const status = element.querySelector('[role="status"]');
    expect(status.getAttribute('aria-live')).toBe('polite');
    expect(status.textContent.trim()).toBe('copilot.embedded.typing');

    setState({ pendingAnswer: 'A partial answer' });
    expect(status.textContent.trim()).toBe('copilot.embedded.typing');

    setState({
      messages: [
        { message: 'Question', type: 'userMessage' },
        { message: 'A complete answer', type: 'apiMessage' },
      ],
    });
    expect(status.textContent.trim()).toBe('copilot.embedded.typing');

    setState({ loading: false, pendingAnswer: '' });
    expect(status.textContent.trim()).toBe('A complete answer');
  });

  it('should announce when recommended products are available', () => {
    setState({
      messages: [{ ...botMessage(), products: [{ sku: 'product-1' }] }],
    });

    expect(element.querySelector('[role="status"]').textContent.trim()).toBe(
      'How do these employees mainly work? copilot.embedded.results.announcement'
    );
  });

  it('should not announce product availability when a reply has no recommended products', () => {
    setState({ messages: [botMessage()] });

    expect(element.querySelector('[role="status"]').textContent.trim()).toBe('How do these employees mainly work?');
  });

  it('should announce request errors', () => {
    setState({ error: 'copilot.embedded.error.generic' });

    expect(element.querySelector('[role="status"]').textContent.trim()).toBe('copilot.embedded.error.generic');
  });

  it('should show the welcome prompts before a conversation starts', () => {
    fixture.detectChanges();

    expect(element.querySelector('.copilot-embedded-welcome')).toBeTruthy();
    expect(element.querySelectorAll('.copilot-embedded-prompts button')).toHaveLength(4);
  });

  it('should reset the conversation from the header', () => {
    setState({ messages: [botMessage()] });

    fixture.debugElement.query(By.directive(CopilotEmbeddedHeaderComponent)).componentInstance.resetChat.emit();

    verify(context.reset()).once();
  });

  describe('sending', () => {
    it('should disable sending while loading', () => {
      setState({ loading: true });

      expect(
        element.querySelector<HTMLButtonElement>('[aria-label="copilot.embedded.input.send"]').disabled
      ).toBeTrue();
    });

    it('should send the typed question', () => {
      fixture.detectChanges();

      const input = element.querySelector<HTMLInputElement>('#copilot-embedded-question');
      input.value = 'Test question';
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

      verify(context.send(deepEqual({ question: 'Test question' }))).once();
    });

    it('should send a welcome prompt', () => {
      fixture.detectChanges();

      element.querySelector<HTMLButtonElement>('.copilot-embedded-prompts button').click();

      verify(context.send(deepEqual({ question: 'copilot.embedded.prompt_1' }))).once();
    });

    it('should send the chosen answer', () => {
      setState({ messages: [botMessage({ options: ['Hybrid', 'In the office'], multiSelect: false })] });

      fixture.debugElement
        .query(By.directive(CopilotEmbeddedMessagesComponent))
        .componentInstance.answer.emit('Hybrid');

      verify(context.send(deepEqual({ question: 'Hybrid' }))).once();
    });
  });

  it('should render the messages once a conversation has started', () => {
    setState({ messages: [botMessage()] });

    expect(element.querySelector('ish-copilot-embedded-messages')).toBeTruthy();
    expect(element.querySelector('.copilot-embedded-welcome')).toBeFalsy();
  });
});
