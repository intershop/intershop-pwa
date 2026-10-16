import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';

import { CopilotEmbeddedContext, CopilotEmbeddedContextFacade } from '../../../facades/copilot-embedded-context.facade';
import { extractProductsFromToolCalls } from '../../../models/copilot-embedded-product/copilot-embedded-product.helper';
import {
  CopilotEmbeddedChatMessage,
  CopilotEmbeddedUpload,
} from '../../../models/copilot-embedded/copilot-embedded.model';

/**
 * Displays the conversation held by the {@link CopilotEmbeddedContextFacade} of the surrounding page.
 */
@Component({
  selector: 'ish-copilot-embedded-chat',
  standalone: false,
  templateUrl: './copilot-embedded-chat.component.html',
  styleUrls: ['./copilot-embedded-chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CopilotEmbeddedChatComponent implements OnInit {
  @Input() deviceType: DeviceType;

  context$: Observable<CopilotEmbeddedContext>;
  /** Necessary for a11y: text of the screen reader live region */
  announcement$: Observable<string>;

  readonly promptKeys = [
    'copilot.embedded.prompt_1',
    'copilot.embedded.prompt_2',
    'copilot.embedded.prompt_3',
    'copilot.embedded.prompt_4',
  ];

  constructor(
    private context: CopilotEmbeddedContextFacade,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.context$ = this.context.select();
    this.announcement$ = this.context$.pipe(
      map(context => this.announcementFor(context)),
      distinctUntilChanged()
    );
  }

  send(payload: { question: string; uploads?: CopilotEmbeddedUpload[]; thumbnail?: string }) {
    this.context.send(payload);
  }

  resetChat() {
    this.context.reset();
  }

  /**
   * Necessary for a11y: Keeps the live region on the request state.
   * Streamed tokens are not part of it to avoid a flood of updates.
   */
  private announcementFor({ error, loading, messages }: CopilotEmbeddedContext): string {
    if (error) {
      return this.translateService.instant(error);
    }
    if (loading) {
      return this.translateService.instant('copilot.embedded.typing');
    }
    const lastMessage = messages.at(-1);
    return lastMessage?.type === 'apiMessage' ? this.replyAnnouncement(lastMessage) : '';
  }

  /** Necessary for a11y: announce available recommendations and answer choices with the reply. */
  private replyAnnouncement(message: CopilotEmbeddedChatMessage): string {
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
