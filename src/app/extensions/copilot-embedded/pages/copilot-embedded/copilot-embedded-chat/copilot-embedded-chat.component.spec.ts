import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterModule, provideRouter } from '@angular/router';
import { TranslatePipe, provideTranslateService } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { anything, capture, spy, verify } from 'ts-mockito';

import { CopilotEmbeddedChatMessage } from '../../../models/copilot-embedded/copilot-embedded.model';
import { CopilotEmbeddedHeaderComponent } from '../copilot-embedded-header/copilot-embedded-header.component';
import { CopilotEmbeddedInputComponent } from '../copilot-embedded-input/copilot-embedded-input.component';
import { CopilotEmbeddedMessagesComponent } from '../copilot-embedded-messages/copilot-embedded-messages.component';

import { CopilotEmbeddedChatComponent } from './copilot-embedded-chat.component';

describe('Copilot Embedded Chat Component', () => {
  let component: CopilotEmbeddedChatComponent;
  let fixture: ComponentFixture<CopilotEmbeddedChatComponent>;
  let element: HTMLElement;

  function botMessage(choices?: CopilotEmbeddedChatMessage['choices']): CopilotEmbeddedChatMessage {
    return { message: 'How do these employees mainly work?', type: 'apiMessage', choices };
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule, TranslatePipe],
      declarations: [
        CopilotEmbeddedChatComponent,
        CopilotEmbeddedInputComponent,
        MockComponent(CopilotEmbeddedHeaderComponent),
        MockComponent(CopilotEmbeddedMessagesComponent),
      ],
      providers: [provideRouter([]), provideTranslateService()],
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
    component.error = 'copilot.embedded.error.generic';
    fixture.detectChanges();

    expect(element.querySelector('.copilot-embedded-error').textContent.trim()).toBe('copilot.embedded.error.generic');
  });

  it('should announce loading and completed replies without announcing streamed tokens', () => {
    fixture.componentRef.setInput('messages', [{ message: 'Question', type: 'userMessage' }]);
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const status = element.querySelector('[role="status"]');
    expect(status.getAttribute('aria-live')).toBe('polite');
    expect(status.textContent.trim()).toBe('copilot.embedded.typing');

    fixture.componentRef.setInput('pendingAnswer', 'A partial answer');
    fixture.detectChanges();
    expect(status.textContent.trim()).toBe('copilot.embedded.typing');

    fixture.componentRef.setInput('messages', [
      { message: 'Question', type: 'userMessage' },
      { message: 'A complete answer', type: 'apiMessage' },
    ]);
    fixture.detectChanges();
    expect(status.textContent.trim()).toBe('copilot.embedded.typing');

    fixture.componentRef.setInput('loading', false);
    fixture.detectChanges();
    expect(status.textContent.trim()).toBe('A complete answer');
  });

  it('should announce when recommended products are available', () => {
    fixture.componentRef.setInput('messages', [
      {
        ...botMessage(),
        usedTools: [
          {
            tool: 'icmSearch',
            toolInput: {},
            toolOutput: JSON.stringify({ output: [{ products: [{ sku: 'product-1' }] }] }),
          },
        ],
      },
    ]);
    fixture.detectChanges();

    expect(element.querySelector('[role="status"]').textContent.trim()).toBe(
      'How do these employees mainly work? copilot.embedded.results.announcement'
    );
  });

  it('should not announce product availability when a reply has no recommended products', () => {
    fixture.componentRef.setInput('messages', [botMessage()]);
    fixture.detectChanges();

    expect(element.querySelector('[role="status"]').textContent.trim()).toBe('How do these employees mainly work?');
  });

  it('should announce request errors', () => {
    fixture.componentRef.setInput('error', 'copilot.embedded.error.generic');
    fixture.detectChanges();

    expect(element.querySelector('[role="status"]').textContent.trim()).toBe('copilot.embedded.error.generic');
  });

  it('should show the welcome prompts before a conversation starts', () => {
    fixture.detectChanges();

    expect(element.querySelector('.copilot-embedded-welcome')).toBeTruthy();
    expect(element.querySelectorAll('.copilot-embedded-prompt-badges button')).toHaveLength(4);
  });

  describe('sending', () => {
    it('should disable sending while loading', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      expect(
        element.querySelector<HTMLButtonElement>('[aria-label="copilot.embedded.input.send"]').disabled
      ).toBeTrue();
    });

    it('should send the typed question', () => {
      const emitter = spy(component.send);
      fixture.detectChanges();

      const input = element.querySelector<HTMLInputElement>('#copilot-embedded-question');
      input.value = 'Test question';
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

      verify(emitter.emit(anything())).once();
      expect(capture(emitter.emit).last()).toEqual([{ question: 'Test question' }]);
    });

    it('should send a welcome prompt', () => {
      const emitter = spy(component.send);
      fixture.detectChanges();

      element.querySelector<HTMLButtonElement>('.copilot-embedded-prompt-badges button').click();

      verify(emitter.emit(anything())).once();
      expect(capture(emitter.emit).last()).toEqual([{ question: 'copilot.embedded.prompt_1' }]);
    });

    it('should send the chosen answer', () => {
      const emitter = spy(component.send);
      component.messages = [botMessage({ options: ['Hybrid', 'In the office'], multiSelect: false })];
      fixture.detectChanges();

      fixture.debugElement
        .query(By.directive(CopilotEmbeddedMessagesComponent))
        .componentInstance.answer.emit('Hybrid');

      verify(emitter.emit(anything())).once();
      expect(capture(emitter.emit).last()).toEqual([{ question: 'Hybrid' }]);
    });
  });

  it('should render the messages once a conversation has started', () => {
    component.messages = [botMessage()];
    fixture.detectChanges();

    expect(element.querySelector('ish-copilot-embedded-messages')).toBeTruthy();
    expect(element.querySelector('.copilot-embedded-welcome')).toBeFalsy();
  });
});
