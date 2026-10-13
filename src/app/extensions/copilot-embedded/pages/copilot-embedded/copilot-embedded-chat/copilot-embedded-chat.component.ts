import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';

import { extractProductsFromToolCalls } from '../../../models/copilot-embedded-product/copilot-embedded-product.helper';
import {
  CopilotEmbeddedChatMessage,
  CopilotEmbeddedUpload,
} from '../../../models/copilot-embedded/copilot-embedded.model';

@Component({
  selector: 'ish-copilot-embedded-chat',
  standalone: false,
  templateUrl: './copilot-embedded-chat.component.html',
  styleUrls: ['./copilot-embedded-chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CopilotEmbeddedChatComponent implements OnChanges {
  @Input() deviceType: DeviceType;
  @Input() messages: CopilotEmbeddedChatMessage[] = [];
  @Input() pendingAnswer = '';
  @Input() loading = false;
  @Input() error: string;
  @Input() toolErrors: { tool: string; error: string }[] = [];

  /** Necessary for a11y: text of the screen reader live region */
  announcement = '';

  @Output() readonly send = new EventEmitter<{
    question: string;
    uploads?: CopilotEmbeddedUpload[];
    thumbnail?: string;
  }>();

  @Output() readonly resetChat = new EventEmitter<void>();

  readonly promptKeys = [
    'copilot.embedded.prompt_1',
    'copilot.embedded.prompt_2',
    'copilot.embedded.prompt_3',
    'copilot.embedded.prompt_4',
  ];

  constructor(private translateService: TranslateService) {}

  ngOnChanges(changes: SimpleChanges) {
    this.updateAnnouncement(changes);
  }

  /**
   * Necessary for a11y: Keeps the live region on the request state.
   * Streamed tokens are skipped to avoid a flood of updates.
   */
  private updateAnnouncement(changes: SimpleChanges) {
    if (changes.error && this.error) {
      this.announcement = this.translateService.instant(this.error);
    } else if (changes.loading && this.loading) {
      this.announcement = this.translateService.instant('copilot.embedded.typing');
    } else if ((changes.messages || changes.loading) && !this.loading) {
      const lastMessage = this.messages?.at(-1);
      this.announcement = lastMessage?.type === 'apiMessage' ? this.announcementFor(lastMessage) : '';
    }
  }

  /** Necessary for a11y: announce available recommendations and answer choices with the reply. */
  private announcementFor(message: CopilotEmbeddedChatMessage): string {
    const announcements = [message.message];
    if (extractProductsFromToolCalls(message.usedTools).length) {
      announcements.push(this.translateService.instant('copilot.embedded.results.announcement'));
    }
    const options = message.choices?.options;
    if (options?.length) {
      announcements.push(
        this.translateService.instant('copilot.embedded.choices.announcement', {
          '0': options.join(', '),
        })
      );
    }
    return announcements.join(' ');
  }
}
