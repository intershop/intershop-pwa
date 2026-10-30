import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Injector,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  afterNextRender,
  inject,
} from '@angular/core';

import { CopilotEmbeddedChatMessage } from '../../../models/copilot-embedded-chat-message/copilot-embedded-chat-message.model';

/**
 * Displays the Copilot Embedded chat transcript, including the streaming answer, and keeps it scrolled to the latest message.
 */
@Component({
  selector: 'ish-copilot-embedded-messages',
  standalone: false,
  templateUrl: './copilot-embedded-messages.component.html',
  styleUrls: ['./copilot-embedded-messages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CopilotEmbeddedMessagesComponent implements OnChanges {
  @Input() messages: CopilotEmbeddedChatMessage[] = [];
  @Input() pendingAnswer = '';
  @Input() loading = false;

  /** Answer the user picked from the choice chips of the last reply. */
  @Output() readonly answer = new EventEmitter<string>();

  @ViewChild('chatWindow') private chatWindow: ElementRef<HTMLElement>;

  private injector = inject(Injector);
  private stickToBottom = true;

  ngOnChanges(changes: SimpleChanges<CopilotEmbeddedMessagesComponent>) {
    // the user's own message always brings the transcript back to the bottom
    if (changes.messages && this.messages?.at(-1)?.type === 'userMessage') {
      this.stickToBottom = true;
    }
    if (changes.messages || changes.pendingAnswer) {
      // scroll once the new content is rendered (browser only)
      afterNextRender(() => this.scrollToBottom(), { injector: this.injector });
    }
  }

  /** Keeps auto-scroll active only while the user is near the bottom of the transcript. */
  onChatScroll() {
    const el = this.chatWindow?.nativeElement;
    if (el) {
      this.stickToBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
    }
  }

  /** Scrolls the transcript container itself; ViewportScroller only scrolls the window. */
  private scrollToBottom() {
    const el = this.chatWindow?.nativeElement;
    if (el && this.stickToBottom) {
      el.scrollTop = el.scrollHeight;
    }
  }
}
