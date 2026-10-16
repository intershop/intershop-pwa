import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, fromEvent, merge } from 'rxjs';

import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';

import { CopilotEmbeddedUserInput } from '../../../models/copilot-embedded-chat-message/copilot-embedded-chat-message.model';
import { CopilotEmbeddedUploadHelper } from '../../../models/copilot-embedded-upload/copilot-embedded-upload.helper';
import { CopilotEmbeddedUpload } from '../../../models/copilot-embedded-upload/copilot-embedded-upload.model';

// mirrors the Flowise embed defaults for vision uploads (imgUploadSizeAndTypes)
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

const MAX_IMAGE_SIZE_MB = 5;

@Component({
  selector: 'ish-copilot-embedded-input',
  standalone: false,
  templateUrl: './copilot-embedded-input.component.html',
  styleUrls: ['./copilot-embedded-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CopilotEmbeddedInputComponent implements AfterViewInit {
  @Input() deviceType: DeviceType;
  @Input() loading = false;

  @Output() readonly send = new EventEmitter<CopilotEmbeddedUserInput>();

  @ViewChild('questionInput') private questionInput: ElementRef<HTMLInputElement>;

  /** Image the user attached to the next message (vision input), if any. */
  pendingUpload: CopilotEmbeddedUpload;

  /** Small JPEG version of the attached image, shown in the chat bubble and persisted. */
  private pendingThumbnail: string;

  /** Translation key of the reason the last selected file was refused, if any. */
  uploadError: string;

  readonly acceptedImageTypes = ALLOWED_IMAGE_TYPES.join(',');
  readonly maxImageSizeMb = MAX_IMAGE_SIZE_MB;

  private destroyRef = inject(DestroyRef);

  constructor(private cdRef: ChangeDetectorRef) {}

  /** Keeps the focused mobile input visible after the keyboard animation settles. */
  ngAfterViewInit() {
    if (SSR) {
      return;
    }
    const input = this.questionInput.nativeElement;
    merge(fromEvent(input, 'focus'), fromEvent(window.visualViewport ?? window, 'resize'))
      .pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (this.deviceType === 'mobile' && input.ownerDocument.activeElement === input) {
          input.scrollIntoView({ block: 'end', behavior: 'instant' });
        }
      });
  }

  /** Sends the given answer or, without one, the typed question; an attached image is always included. */
  submit(answer?: string) {
    const field = this.questionInput.nativeElement;
    const question = (answer ?? field.value).trim();
    if ((question || this.pendingUpload) && !this.loading) {
      const uploads = this.pendingUpload ? [this.pendingUpload] : undefined;
      const thumbnail = uploads ? this.pendingThumbnail : undefined;
      this.send.emit({ question, ...(uploads ? { uploads } : {}), ...(thumbnail ? { thumbnail } : {}) });
      if (answer === undefined) {
        field.value = '';
      }
      this.removeUpload();
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) {
      return;
    }
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      this.uploadError = 'copilot.embedded.input.image_invalid_type';
      return;
    }
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      this.uploadError = 'copilot.embedded.input.image_too_large';
      return;
    }
    this.uploadError = undefined;
    CopilotEmbeddedUploadHelper.readImageUpload(file).then(({ upload, thumbnail }) => {
      this.pendingUpload = upload;
      this.pendingThumbnail = thumbnail;
      this.cdRef.markForCheck();
    });
  }

  /** Discards the attached image before it is sent. */
  removeUpload() {
    this.pendingUpload = undefined;
    this.pendingThumbnail = undefined;
    this.uploadError = undefined;
  }
}
