import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  afterNextRender,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, fromEvent, merge } from 'rxjs';

import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';

import { CopilotEmbeddedUserInput } from '../../../facades/copilot-embedded-context.facade';
import { CopilotEmbeddedUploadHelper } from '../../../models/copilot-embedded-upload/copilot-embedded-upload.helper';
import { CopilotEmbeddedUpload } from '../../../models/copilot-embedded-upload/copilot-embedded-upload.model';

// mirrors the Flowise embed defaults for vision uploads (imgUploadSizeAndTypes)
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

const MAX_IMAGE_SIZE_MB = 5;

/**
 * Displays the chat input field where the user types a question, optionally attaches an image and sends both.
 */
@Component({
  selector: 'ish-copilot-embedded-input',
  standalone: false,
  templateUrl: './copilot-embedded-input.component.html',
  styleUrls: ['./copilot-embedded-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CopilotEmbeddedInputComponent {
  @Input({ required: true }) deviceType: DeviceType;
  @Input() loading = false;

  @Output() readonly send = new EventEmitter<CopilotEmbeddedUserInput>();

  @ViewChild('questionInput') private questionInput: ElementRef<HTMLInputElement>;

  readonly form = new FormGroup({ question: new FormControl('') });
  readonly acceptedImageTypes = ALLOWED_IMAGE_TYPES.join(',');
  readonly maxImageSizeMb = MAX_IMAGE_SIZE_MB;

  /** Image the user attached to the next message (vision input), if any. */
  pendingUpload: CopilotEmbeddedUpload;

  /** Translation key of the reason the last selected file was refused, if any. */
  uploadError: string;

  /** Small JPEG version of the attached image, shown in the chat bubble and persisted. */
  private pendingThumbnail: string;

  /** Counts image selections and removals, so that reads of an older selection are ignored when they finish. */
  private uploadSelection = 0;

  private destroyRef = inject(DestroyRef);

  constructor(private cdRef: ChangeDetectorRef) {
    afterNextRender(() => this.keepFocusedInputVisible());
  }

  /** Keeps the focused mobile input visible after the keyboard animation settles. */
  private keepFocusedInputVisible() {
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
    const question = (answer ?? this.form.value.question ?? '').trim();
    if ((question || this.pendingUpload) && !this.loading) {
      const uploads = this.pendingUpload ? [this.pendingUpload] : undefined;
      const thumbnail = uploads ? this.pendingThumbnail : undefined;
      this.send.emit({ question, ...(uploads ? { uploads } : {}), ...(thumbnail ? { thumbnail } : {}) });
      if (answer === undefined) {
        this.form.reset();
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
    const selection = ++this.uploadSelection;
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
      if (selection !== this.uploadSelection) {
        return;
      }
      this.pendingUpload = upload;
      this.pendingThumbnail = thumbnail;
      this.cdRef.markForCheck();
    });
  }

  /** Discards the attached image before it is sent, including an image that is still being read. */
  removeUpload() {
    this.uploadSelection++;
    this.pendingUpload = undefined;
    this.pendingThumbnail = undefined;
    this.uploadError = undefined;
  }
}
