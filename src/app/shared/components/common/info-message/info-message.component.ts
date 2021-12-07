import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';

import { MessageFacade } from 'ish-core/facades/message.facade';

/**
 * The Info Message Component displays an info message as inline message or as toast.
 *
 * @example
 * <ish-info-message message="quote.error.not_started" [toast]="false"></ish-info-message>
 */
@Component({
  selector: 'ish-info-message',
  templateUrl: './info-message.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoMessageComponent implements OnChanges {
  @Input() message: string;
  @Input() toast = true;

  constructor(private messageFacade: MessageFacade) {}

  ngOnChanges() {
    if (this.toast) {
      this.displayToast();
    }
  }

  private displayToast() {
    if (this.message) {
      this.messageFacade.info({
        message: this.message,
      });
    }
  }
}
