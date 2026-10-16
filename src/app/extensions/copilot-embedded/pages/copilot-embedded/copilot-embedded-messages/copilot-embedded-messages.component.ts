import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

import { CopilotEmbeddedChatMessage } from '../../../models/copilot-embedded-chat-message/copilot-embedded-chat-message.model';

@Component({
  selector: 'ish-copilot-embedded-messages',
  standalone: false,
  templateUrl: './copilot-embedded-messages.component.html',
  styleUrls: ['./copilot-embedded-messages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CopilotEmbeddedMessagesComponent implements OnChanges, AfterViewChecked {
  @Input() messages: CopilotEmbeddedChatMessage[] = [];
  @Input() pendingAnswer = '';
  @Input() loading = false;

  /** Answer the user picked from the choice chips of the last reply. */
  @Output() readonly answer = new EventEmitter<string>();

  @ViewChild('chatWindow') private chatWindow: ElementRef<HTMLElement>;

  private stickToBottom = true;
  private scrollPending = false;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.messages || changes.pendingAnswer) {
      this.scrollPending = true;
    }
    // the user's own message always brings the transcript back to the bottom
    if (changes.messages && this.messages?.at(-1)?.type === 'userMessage') {
      this.stickToBottom = true;
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
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }
}
