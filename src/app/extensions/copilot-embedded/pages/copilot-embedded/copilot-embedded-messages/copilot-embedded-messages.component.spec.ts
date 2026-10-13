import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslatePipe, provideTranslateService } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { anything, capture, spy, verify } from 'ts-mockito';

import { CopilotEmbeddedChatMessage } from '../../../models/copilot-embedded/copilot-embedded.model';
import { CopilotEmbeddedChoicesComponent } from '../copilot-embedded-choices/copilot-embedded-choices.component';

import { CopilotEmbeddedMessagesComponent } from './copilot-embedded-messages.component';

describe('Copilot Embedded Messages Component', () => {
  let component: CopilotEmbeddedMessagesComponent;
  let fixture: ComponentFixture<CopilotEmbeddedMessagesComponent>;
  let element: HTMLElement;

  function botMessage(choices?: CopilotEmbeddedChatMessage['choices']): CopilotEmbeddedChatMessage {
    return { message: 'How do these employees mainly work?', type: 'apiMessage', choices };
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslatePipe],
      declarations: [CopilotEmbeddedMessagesComponent, MockComponent(CopilotEmbeddedChoicesComponent)],
      providers: [provideTranslateService()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CopilotEmbeddedMessagesComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render user and bot messages', () => {
    fixture.componentRef.setInput('messages', [{ message: 'Question', type: 'userMessage' }, botMessage()]);
    fixture.detectChanges();

    expect(element.querySelectorAll('.copilot-embedded-message-user')).toHaveLength(1);
    expect(element.querySelectorAll('.copilot-embedded-message-bot')).toHaveLength(1);
  });

  it('should render the streamed answer instead of the typing indicator', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    expect(element.querySelector('.copilot-embedded-typing')).toBeTruthy();

    fixture.componentRef.setInput('pendingAnswer', 'A partial answer');
    fixture.detectChanges();
    expect(element.querySelector('.copilot-embedded-typing')).toBeFalsy();
    expect(element.textContent).toContain('A partial answer');
  });

  describe('choice chips', () => {
    it('should render the choices for the last bot message', () => {
      fixture.componentRef.setInput('messages', [botMessage({ options: ['Hybrid', 'Mobile'], multiSelect: false })]);
      fixture.detectChanges();

      expect(element.querySelector('ish-copilot-embedded-choices')).toBeTruthy();
    });

    it('should forward the chosen answer', () => {
      const emitter = spy(component.answer);
      fixture.componentRef.setInput('messages', [botMessage({ options: ['Hybrid', 'Mobile'], multiSelect: false })]);
      fixture.detectChanges();

      fixture.debugElement.query(By.directive(CopilotEmbeddedChoicesComponent)).componentInstance.answer.emit('Hybrid');

      verify(emitter.emit(anything())).once();
      expect(capture(emitter.emit).last()).toEqual(['Hybrid']);
    });

    it('should not render chips for a message that is not the last one', () => {
      fixture.componentRef.setInput('messages', [
        botMessage({ options: ['Hybrid', 'Mobile'], multiSelect: false }),
        { message: 'A later reply', type: 'apiMessage' },
      ]);
      fixture.detectChanges();

      expect(element.querySelector('ish-copilot-embedded-choices')).toBeFalsy();
    });

    it('should not render chips while loading', () => {
      fixture.componentRef.setInput('messages', [botMessage({ options: ['Hybrid', 'Mobile'], multiSelect: false })]);
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      expect(element.querySelector('ish-copilot-embedded-choices')).toBeFalsy();
    });
  });

  describe('auto-scroll', () => {
    let chatWindow: HTMLElement;

    function setScrollMetrics(scrollHeight: number, clientHeight: number) {
      Object.defineProperty(chatWindow, 'scrollHeight', { configurable: true, value: scrollHeight });
      Object.defineProperty(chatWindow, 'clientHeight', { configurable: true, value: clientHeight });
      // jsdom has no layout, scrollTop would always stay 0
      Object.defineProperty(chatWindow, 'scrollTop', { configurable: true, writable: true, value: 0 });
    }

    beforeEach(() => {
      fixture.detectChanges();
      chatWindow = element.querySelector('.copilot-embedded-messages');
      setScrollMetrics(1000, 200);
    });

    it('should scroll to the bottom when a new message arrives', () => {
      fixture.componentRef.setInput('messages', [botMessage()]);
      fixture.detectChanges();

      expect(chatWindow.scrollTop).toBe(1000);
    });

    it('should not scroll while the user reads older messages', () => {
      chatWindow.scrollTop = 100;
      chatWindow.dispatchEvent(new Event('scroll'));

      fixture.componentRef.setInput('messages', [botMessage()]);
      fixture.detectChanges();

      expect(chatWindow.scrollTop).toBe(100);
    });

    it('should scroll to the bottom again when the user sends a message', () => {
      chatWindow.scrollTop = 100;
      chatWindow.dispatchEvent(new Event('scroll'));

      fixture.componentRef.setInput('messages', [botMessage(), { message: 'Question', type: 'userMessage' }]);
      fixture.detectChanges();

      expect(chatWindow.scrollTop).toBe(1000);
    });
  });
});
