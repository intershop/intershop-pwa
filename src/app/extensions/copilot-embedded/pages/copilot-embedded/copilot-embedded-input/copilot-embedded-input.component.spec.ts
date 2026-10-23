import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, provideRouter } from '@angular/router';
import { TranslatePipe, provideTranslateService } from '@ngx-translate/core';
import { anything, capture, spy, verify } from 'ts-mockito';

import { CopilotEmbeddedUploadHelper } from '../../../models/copilot-embedded-upload/copilot-embedded-upload.helper';

import { CopilotEmbeddedInputComponent } from './copilot-embedded-input.component';

describe('Copilot Embedded Input Component', () => {
  let component: CopilotEmbeddedInputComponent;
  let fixture: ComponentFixture<CopilotEmbeddedInputComponent>;
  let element: HTMLElement;
  let input: HTMLInputElement;

  const upload = { data: 'data:image/png;base64,AAAA', type: 'file' as const, name: 'photo.png', mime: 'image/png' };

  function typeQuestion(value: string) {
    input.value = value;
    input.dispatchEvent(new Event('input'));
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterModule, TranslatePipe],
      declarations: [CopilotEmbeddedInputComponent],
      providers: [provideRouter([]), provideTranslateService()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CopilotEmbeddedInputComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.deviceType = 'desktop';
    fixture.detectChanges();
    input = element.querySelector<HTMLInputElement>('#copilot-embedded-question');
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should disable sending while loading', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    expect(element.querySelector<HTMLButtonElement>('[aria-label="copilot.embedded.input.send"]').disabled).toBeTrue();
  });

  describe('submit', () => {
    it('should submit and clear the question on form submit', () => {
      const emitter = spy(component.send);

      typeQuestion('Test question');
      element.querySelector('form').dispatchEvent(new Event('submit'));

      verify(emitter.emit(anything())).once();
      expect(capture(emitter.emit).last()).toEqual([{ question: 'Test question' }]);
      expect(input.value).toBeEmpty();
    });

    it('should submit and clear the question on send button click', () => {
      const emitter = spy(component.send);

      typeQuestion('Test question');
      element.querySelector<HTMLButtonElement>('[aria-label="copilot.embedded.input.send"]').click();

      verify(emitter.emit(anything())).once();
      expect(capture(emitter.emit).last()).toEqual([{ question: 'Test question' }]);
      expect(input.value).toBeEmpty();
    });

    it('should not submit or clear the question while loading', () => {
      const emitter = spy(component.send);
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      typeQuestion('please wait');
      element.querySelector('form').dispatchEvent(new Event('submit'));

      verify(emitter.emit(anything())).never();
      expect(input.value).toBe('please wait');
    });

    it('should send a given answer and keep the typed question', () => {
      const emitter = spy(component.send);
      typeQuestion('my own text');

      component.submit('Hybrid');

      verify(emitter.emit(anything())).once();
      expect(capture(emitter.emit).last()).toEqual([{ question: 'Hybrid' }]);
      expect(input.value).toBe('my own text');
    });

    it('should not emit when there is neither text nor an image', () => {
      const emitter = spy(component.send);

      component.submit('   ');

      verify(emitter.emit(anything())).never();
    });
  });

  describe('image attachment', () => {
    it('should emit the attached image together with the question', () => {
      const emitter = spy(component.send);
      component.pendingUpload = upload;

      component.submit('what is this?');

      verify(emitter.emit(anything())).once();
      expect(capture(emitter.emit).last()).toEqual([{ question: 'what is this?', uploads: [upload] }]);
      expect(component.pendingUpload).toBeUndefined();
    });

    it('should emit an image without any question text', () => {
      const emitter = spy(component.send);
      component.pendingUpload = upload;

      component.submit();

      verify(emitter.emit(anything())).once();
      expect(capture(emitter.emit).last()).toEqual([{ question: '', uploads: [upload] }]);
    });

    it('should emit the thumbnail together with the full-size upload', () => {
      const emitter = spy(component.send);
      component.pendingUpload = upload;
      // eslint-disable-next-line @typescript-eslint/dot-notation
      component['pendingThumbnail'] = 'data:image/jpeg;base64,THUMB';

      component.submit();

      verify(emitter.emit(anything())).once();
      expect(capture(emitter.emit).last()).toEqual([
        { question: '', uploads: [upload], thumbnail: 'data:image/jpeg;base64,THUMB' },
      ]);
      // eslint-disable-next-line @typescript-eslint/dot-notation
      expect(component['pendingThumbnail']).toBeUndefined();
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
      const fileInput = element.querySelector<HTMLInputElement>('.copilot-embedded-image-input');
      Object.defineProperty(fileInput, 'files', {
        value: [new File(['x'], 'archive.zip', { type: 'application/zip' })],
      });

      fileInput.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      expect(element.querySelector('.invalid-feedback')).toBeTruthy();
    });

    describe('pending image reads', () => {
      type ImageRead = Awaited<ReturnType<typeof CopilotEmbeddedUploadHelper.readImageUpload>>;

      // resolvers of the started reads, in selection order
      let finishRead: ((read: ImageRead) => void)[];

      function imageRead(name: string): ImageRead {
        return { upload: { ...upload, name }, thumbnail: `thumbnail-${name}` };
      }

      async function finish(index: number, name: string) {
        finishRead[index](imageRead(name));
        // let the component's `then` callback run
        await Promise.resolve();
      }

      beforeEach(() => {
        finishRead = [];
        jest
          .spyOn(CopilotEmbeddedUploadHelper, 'readImageUpload')
          .mockImplementation(() => new Promise(resolve => finishRead.push(resolve)));
      });

      it('should keep the latest selected image when an older read finishes later', async () => {
        component.onFileSelected(fileEvent(fileOfSize('a.png', 'image/png', 1024)));
        component.onFileSelected(fileEvent(fileOfSize('b.png', 'image/png', 1024)));

        await finish(1, 'b.png');
        await finish(0, 'a.png');

        expect(component.pendingUpload.name).toBe('b.png');
      });

      it('should not attach an image whose read finishes after the message was sent', async () => {
        component.onFileSelected(fileEvent(fileOfSize('a.png', 'image/png', 1024)));
        component.submit('a question');

        await finish(0, 'a.png');

        expect(component.pendingUpload).toBeUndefined();
      });

      it('should not attach an image whose read finishes after it was removed', async () => {
        component.onFileSelected(fileEvent(fileOfSize('a.png', 'image/png', 1024)));
        component.removeUpload();

        await finish(0, 'a.png');

        expect(component.pendingUpload).toBeUndefined();
      });

      it('should not attach an older image after a refused selection', async () => {
        component.onFileSelected(fileEvent(fileOfSize('a.png', 'image/png', 1024)));
        component.onFileSelected(fileEvent(new File(['x'], 'archive.zip', { type: 'application/zip' })));

        await finish(0, 'a.png');

        expect(component.pendingUpload).toBeUndefined();
        expect(component.uploadError).toBe('copilot.embedded.input.image_invalid_type');
      });
    });
  });
});
