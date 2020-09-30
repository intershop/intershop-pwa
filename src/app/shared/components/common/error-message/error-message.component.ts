import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';

import { MessageFacade } from 'ish-core/facades/message.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';

/**
 * The Error Message Component displays an error message for an {@link HttpError}.
 *
 * @example
   <ish-error-message [error]="error"></ish-error-message>
 */
@Component({
  selector: 'ish-error-message',
  templateUrl: './error-message.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorMessageComponent implements OnChanges {
  @Input() error: HttpError;
  @Input() toast = true;

  constructor(private messagesFacade: MessageFacade) {}

  ngOnChanges() {
    if (this.toast) {
      this.displayToast();
    }
  }

  private displayToast() {
    if (this.error) {
      this.messagesFacade.error({
        message: this.error.message || this.error.code,
      });
    }
  }
}
