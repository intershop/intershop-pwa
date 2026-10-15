import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslatePipe, provideTranslateService } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { deepEqual, instance, mock, verify, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';

import { CopilotEmbeddedContext, CopilotEmbeddedContextFacade } from '../../facades/copilot-embedded-context.facade';

import { CopilotEmbeddedChatComponent } from './copilot-embedded-chat/copilot-embedded-chat.component';
import { CopilotEmbeddedPageComponent } from './copilot-embedded-page.component';
import { CopilotEmbeddedResultsComponent } from './copilot-embedded-results/copilot-embedded-results.component';

describe('Copilot Embedded Page Component', () => {
  let fixture: ComponentFixture<CopilotEmbeddedPageComponent>;
  let component: CopilotEmbeddedPageComponent;
  let element: HTMLElement;
  let context: CopilotEmbeddedContextFacade;

  const state: CopilotEmbeddedContext = {
    chatflowid: 'flow-1',
    sessionId: 'session-1',
    chatId: 'chat-1',
    messages: [{ message: 'A recommendation', type: 'apiMessage' }],
    pendingAnswer: '',
    loading: false,
    error: undefined,
    toolErrors: [],
    products: [{ sku: 'product-1' }],
  };

  beforeEach(async () => {
    context = mock(CopilotEmbeddedContextFacade);
    when(context.select()).thenReturn(of(state));

    await TestBed.configureTestingModule({
      imports: [TranslatePipe],
      declarations: [
        CopilotEmbeddedPageComponent,
        MockComponent(CopilotEmbeddedChatComponent),
        MockComponent(CopilotEmbeddedResultsComponent),
      ],
      providers: [{ provide: AppFacade, useValue: { deviceType$: of('desktop') } }, provideTranslateService()],
    })
      .overrideComponent(CopilotEmbeddedPageComponent, {
        set: { providers: [{ provide: CopilotEmbeddedContextFacade, useFactory: () => instance(context) }] },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CopilotEmbeddedPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should pass the conversation state to the chat and results', () => {
    fixture.detectChanges();

    const chat: CopilotEmbeddedChatComponent = fixture.debugElement.query(
      By.directive(CopilotEmbeddedChatComponent)
    ).componentInstance;
    const results: CopilotEmbeddedResultsComponent = fixture.debugElement.query(
      By.directive(CopilotEmbeddedResultsComponent)
    ).componentInstance;

    expect(chat.messages).toEqual(state.messages);
    expect(results.products).toEqual(state.products);
  });

  it('should delegate sending and resetting to the context', () => {
    component.onSend({ question: 'find laptops' });
    component.resetSession();

    verify(context.send(deepEqual({ question: 'find laptops' }))).once();
    verify(context.reset()).once();
  });
});
