import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslatePipe, provideTranslateService } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { anything, capture, spy, verify } from 'ts-mockito';

import { CopilotEmbeddedChatMessage } from '../../../models/copilot-embedded/copilot-embedded.model';
import { CopilotEmbeddedHeaderComponent } from '../copilot-embedded-header/copilot-embedded-header.component';

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
      imports: [TranslatePipe],
      declarations: [CopilotEmbeddedChatComponent, MockComponent(CopilotEmbeddedHeaderComponent)],
      providers: [provideTranslateService()],
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

  it('should disable sending and show the typing indicator while loading', () => {
    component.messages = [{ message: 'Question', type: 'userMessage' }];
    component.loading = true;
    fixture.detectChanges();

    expect(element.querySelector('.copilot-embedded-typing')).toBeTruthy();
    expect(element.querySelector<HTMLButtonElement>('[aria-label="copilot.embedded.input.send"]').disabled).toBeTrue();
  });

  it('should not emit a message while loading', () => {
    const emitter = spy(component.send);
    component.loading = true;

    component.submit('please wait');

    verify(emitter.emit(anything())).never();
  });

  it('should submit and clear the question on Enter keydown', () => {
    const emitter = spy(component.send);
    fixture.detectChanges();

    const input = element.querySelector<HTMLInputElement>('#copilot-embedded-question');
    input.value = 'Test question';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    input.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', bubbles: true }));

    verify(emitter.emit(anything())).once();
    const [payload] = capture(emitter.emit).last();
    expect(payload).toEqual({ question: 'Test question' });
    expect(input.value).toBeEmpty();
  });

  it('should not submit or clear the question on Enter while loading', () => {
    const emitter = spy(component.send);
    component.loading = true;
    fixture.detectChanges();

    const input = element.querySelector<HTMLInputElement>('#copilot-embedded-question');
    input.value = 'please wait';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    verify(emitter.emit(anything())).never();
    expect(input.value).toBe('please wait');
  });

  describe('choice chips', () => {
    it('should render single-select chips without a confirm button for the last bot message', () => {
      component.messages = [botMessage({ options: ['In the office', 'Hybrid', 'Mobile'], multiSelect: false })];
      fixture.detectChanges();

      const chips = element.querySelectorAll('.copilot-embedded-choices .copilot-embedded-choice-chip');
      expect(chips).toHaveLength(3);
      expect(element.querySelector('.copilot-embedded-choice-confirm')).toBeFalsy();
    });

    it('should emit the option label when a single-select chip is clicked', () => {
      const emitter = spy(component.send);
      component.messages = [botMessage({ options: ['Hybrid', 'In the office'], multiSelect: false })];
      fixture.detectChanges();

      element.querySelector<HTMLButtonElement>('.copilot-embedded-choice-chip').click();

      verify(emitter.emit(anything())).once();
      const [payload] = capture(emitter.emit).last();
      expect(payload).toEqual({ question: 'Hybrid' });
    });

    it('should render a confirm button for multi-select and emit the joined selection', () => {
      const emitter = spy(component.send);
      component.messages = [botMessage({ options: ['Docking station', 'Headset', 'Monitor'], multiSelect: true })];
      fixture.detectChanges();

      const chips = element.querySelectorAll<HTMLButtonElement>('.copilot-embedded-choice-chip');
      chips[0].click();
      chips[1].click();
      fixture.detectChanges();

      const confirm = element.querySelector<HTMLButtonElement>('.copilot-embedded-choice-confirm');
      expect(confirm.disabled).toBeFalse();
      confirm.click();

      verify(emitter.emit(anything())).once();
      const [payload] = capture(emitter.emit).last();
      expect(payload).toEqual({ question: 'Docking station, Headset' });
    });

    it('should keep the confirm button disabled while nothing is selected', () => {
      component.messages = [botMessage({ options: ['Headset', 'Monitor'], multiSelect: true })];
      fixture.detectChanges();

      expect(element.querySelector<HTMLButtonElement>('.copilot-embedded-choice-confirm').disabled).toBeTrue();
    });

    it('should not render chips for a message that is not the last one', () => {
      component.messages = [
        botMessage({ options: ['Hybrid', 'In the office'], multiSelect: false }),
        { message: 'A later reply', type: 'apiMessage' },
      ];
      fixture.detectChanges();

      expect(element.querySelector('.copilot-embedded-choices')).toBeFalsy();
    });

    it('should not render chips while loading', () => {
      component.messages = [botMessage({ options: ['Hybrid', 'In the office'], multiSelect: false })];
      component.loading = true;
      fixture.detectChanges();

      expect(element.querySelector('.copilot-embedded-choices')).toBeFalsy();
    });

    it('should reset the selection when the messages change', () => {
      component.messages = [botMessage({ options: ['Headset', 'Monitor'], multiSelect: true })];
      component.toggleOption('Monitor');
      expect(component.selectedOptions.has('Monitor')).toBeTrue();

      const next = [botMessage()];
      component.messages = next;
      component.ngOnChanges({ messages: new SimpleChange(undefined, next, false) });

      expect(component.selectedOptions.size).toBe(0);
    });
  });

  describe('image attachment', () => {
    const upload = { data: 'data:image/png;base64,AAAA', type: 'file' as const, name: 'photo.png', mime: 'image/png' };

    it('should emit the attached image together with the question', () => {
      const emitter = spy(component.send);
      component.pendingUpload = upload;

      component.submit('what is this?');

      verify(emitter.emit(anything())).once();
      const [payload] = capture(emitter.emit).last();
      expect(payload).toEqual({ question: 'what is this?', uploads: [upload] });
      expect(component.pendingUpload).toBeUndefined();
    });

    it('should emit an image without any question text', () => {
      const emitter = spy(component.send);
      component.pendingUpload = upload;

      component.submit('');

      verify(emitter.emit(anything())).once();
      const [payload] = capture(emitter.emit).last();
      expect(payload).toEqual({ question: '', uploads: [upload] });
    });

    it('should emit the thumbnail together with the full-size upload', () => {
      const emitter = spy(component.send);
      component.pendingUpload = upload;
      // eslint-disable-next-line @typescript-eslint/dot-notation
      component['pendingThumbnail'] = 'data:image/jpeg;base64,THUMB';

      component.submit('');

      verify(emitter.emit(anything())).once();
      const [payload] = capture(emitter.emit).last();
      expect(payload).toEqual({ question: '', uploads: [upload], thumbnail: 'data:image/jpeg;base64,THUMB' });
      // eslint-disable-next-line @typescript-eslint/dot-notation
      expect(component['pendingThumbnail']).toBeUndefined();
    });

    it('should not emit when there is neither text nor an image', () => {
      const emitter = spy(component.send);

      component.submit('   ');

      verify(emitter.emit(anything())).never();
    });

    it('should discard the attached image on removeUpload', () => {
      component.pendingUpload = upload;
      // eslint-disable-next-line @typescript-eslint/dot-notation
      component['pendingThumbnail'] = 'data:image/jpeg;base64,THUMB';

      component.removeUpload();

      expect(component.pendingUpload).toBeUndefined();
      // eslint-disable-next-line @typescript-eslint/dot-notation
      expect(component['pendingThumbnail']).toBeUndefined();
    });
  });

  describe('image validation', () => {
    afterEach(() => jest.restoreAllMocks());

    function fileEvent(file: File): Event {
      return { target: { files: [file], value: 'C:\\fakepath\\file' } } as unknown as Event;
    }

    function fileOfSize(name: string, type: string, size: number): File {
      const file = new File(['x'], name, { type });
      Object.defineProperty(file, 'size', { value: size });
      return file;
    }

    it.each([
      ['archive.zip', 'application/zip'],
      ['script.ps1', ''],
      ['drawing.svg', 'image/svg+xml'],
    ])('should refuse %s', (name, type) => {
      const readAsDataURL = jest.spyOn(FileReader.prototype, 'readAsDataURL');

      component.onFileSelected(fileEvent(new File(['x'], name, { type })));

      expect(component.uploadError).toBe('copilot.embedded.input.image_invalid_type');
      expect(component.pendingUpload).toBeUndefined();
      expect(readAsDataURL).not.toHaveBeenCalled();
    });

    it('should refuse images larger than 5 MB', () => {
      component.onFileSelected(fileEvent(fileOfSize('huge.png', 'image/png', 5 * 1024 * 1024 + 1)));

      expect(component.uploadError).toBe('copilot.embedded.input.image_too_large');
      expect(component.pendingUpload).toBeUndefined();
    });

    it('should accept a supported image within the size limit', () => {
      const readAsDataURL = jest.spyOn(FileReader.prototype, 'readAsDataURL').mockImplementation(() => undefined);
      component.uploadError = 'copilot.embedded.input.image_invalid_type';

      component.onFileSelected(fileEvent(fileOfSize('photo.webp', 'image/webp', 1024)));

      expect(component.uploadError).toBeUndefined();
      expect(readAsDataURL).toHaveBeenCalled();
    });

    it('should render the refusal message', () => {
      component.uploadError = 'copilot.embedded.input.image_invalid_type';
      fixture.detectChanges();

      expect(element.querySelector('.copilot-embedded-upload-error')).toBeTruthy();
    });
  });
});
