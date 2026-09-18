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
import { TranslateService } from '@ngx-translate/core';

import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';

import { ProductAdvisorChatMessage } from '../../../models/product-advisor/product-advisor.model';

@Component({
  selector: 'ish-product-advisor-chat',
  standalone: false,
  templateUrl: './product-advisor-chat.component.html',
  styleUrls: ['./product-advisor-chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductAdvisorChatComponent implements OnChanges, AfterViewChecked {
  @Input() deviceType: DeviceType;
  @Input() messages: ProductAdvisorChatMessage[] = [];
  @Input() pendingAnswer = '';
  @Input() loading = false;
  @Input() error: string;
  @Input() toolErrors: { tool: string; error: string }[] = [];

  @Output() readonly send = new EventEmitter<string>();

  @ViewChild('chatWindow') private chatWindow: ElementRef<HTMLElement>;

  readonly promptKeys = [
    'copilot.product_advisor.prompt_1',
    'copilot.product_advisor.prompt_2',
    'copilot.product_advisor.prompt_3',
    'copilot.product_advisor.prompt_4',
  ];

  private stickToBottom = true;
  private scrollPending = false;

  constructor(private translateService: TranslateService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.messages || changes.pendingAnswer) {
      this.scrollPending = true;
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
    if (trimmed && !this.loading) {
      this.stickToBottom = true;
      this.send.emit(trimmed);
    }
  }

  private scrollToBottom() {
    const el = this.chatWindow?.nativeElement;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }
}
