import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';

import { createImageThumbnail } from '../../../models/copilot-embedded/copilot-embedded-image.helper';
import {
  CopilotEmbeddedChatMessage,
  CopilotEmbeddedUpload,
} from '../../../models/copilot-embedded/copilot-embedded.model';

// mirrors the Flowise embed defaults for vision uploads (imgUploadSizeAndTypes)
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

const MAX_IMAGE_SIZE_MB = 5;

@Component({
  selector: 'ish-copilot-embedded-chat',
  standalone: false,
  templateUrl: './copilot-embedded-chat.component.html',
  styleUrls: ['./copilot-embedded-chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CopilotEmbeddedChatComponent implements OnChanges, AfterViewChecked {
  @Input() deviceType: DeviceType;
  @Input() messages: CopilotEmbeddedChatMessage[] = [];
  @Input() pendingAnswer = '';
  @Input() loading = false;
  @Input() error: string;
  @Input() toolErrors: { tool: string; error: string }[] = [];

  @Output() readonly send = new EventEmitter<{
    question: string;
    uploads?: CopilotEmbeddedUpload[];
    thumbnail?: string;
  }>();

  @ViewChild('chatWindow') private chatWindow: ElementRef<HTMLElement>;

  readonly promptKeys = [
    'copilot.embedded.prompt_1',
    'copilot.embedded.prompt_2',
    'copilot.embedded.prompt_3',
    'copilot.embedded.prompt_4',
  ];

  private stickToBottom = true;
  private scrollPending = false;

  /** Currently ticked options for the most recent multi-select choice prompt. */
  readonly selectedOptions = new Set<string>();

  /** Image the user attached to the next message (vision input), if any. */
  pendingUpload: CopilotEmbeddedUpload;

  /** Small JPEG version of the attached image, shown in the chat bubble and persisted. */
  private pendingThumbnail: string;

  /** Translation key of the reason the last selected file was refused, if any. */
  uploadError: string;

  readonly acceptedImageTypes = ALLOWED_IMAGE_TYPES.join(',');
  readonly maxImageSizeMb = MAX_IMAGE_SIZE_MB;

  constructor(
    private translateService: TranslateService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.messages || changes.pendingAnswer) {
      this.scrollPending = true;
    }
    if (changes.messages) {
      this.selectedOptions.clear();
    }
  }

  ngAfterViewChecked() {
    if (this.scrollPending) {
      this.scrollPending = false;
      if (this.stickToBottom) {
        this.scrollToBottom();
      }
    }
  }

  /**
   * Keeps auto-scroll active only while the user is near the bottom of the transcript.
   */
  onChatScroll() {
    const el = this.chatWindow?.nativeElement;
    if (el) {
      this.stickToBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
    }
  }

  submitPrompt(promptKey: string) {
    this.submit(this.translateService.instant(promptKey));
  }

  submit(value: string) {
    const trimmed = value?.trim();
    if ((trimmed || this.pendingUpload) && !this.loading) {
      this.stickToBottom = true;
      const uploads = this.pendingUpload ? [this.pendingUpload] : undefined;
      const thumbnail = uploads ? this.pendingThumbnail : undefined;
      this.send.emit({ question: trimmed ?? '', ...(uploads ? { uploads } : {}), ...(thumbnail ? { thumbnail } : {}) });
      this.removeUpload();
    }
  }

  /** Reads the selected image file into a base64 data URL to attach to the next message. */
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
    const reader = new FileReader();
    reader.onload = () => {
      const data = reader.result as string;
      createImageThumbnail(data).then(thumbnail => {
        this.pendingUpload = { data, type: 'file', name: file.name, mime: file.type };
        this.pendingThumbnail = thumbnail;
        this.cdRef.markForCheck();
      });
    };
    reader.readAsDataURL(file);
  }

  /** Discards the attached image before it is sent. */
  removeUpload() {
    this.pendingUpload = undefined;
    this.pendingThumbnail = undefined;
    this.uploadError = undefined;
  }

  /** Toggles an option of a multi-select choice prompt. */
  toggleOption(option: string) {
    if (this.selectedOptions.has(option)) {
      this.selectedOptions.delete(option);
    } else {
      this.selectedOptions.add(option);
    }
  }

  /** Sends the ticked options of a multi-select choice prompt as a single comma-separated answer. */
  submitSelectedOptions() {
    if (this.selectedOptions.size) {
      this.submit([...this.selectedOptions].join(', '));
    }
  }

  private scrollToBottom() {
    const el = this.chatWindow?.nativeElement;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }
}
