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

  constructor(private messageFacade: MessageFacade) {}

  ngOnChanges() {
    if (this.toast) {
      this.displayToast(this.error);
    }
  }

  private displayToast(err: HttpError) {
    if (err && !err.errors) {
      this.messageFacade.error({
        message: err.message || err.code,
      });
    }
    if (err?.errors) {
      err?.errors.map(cause => {
        this.messageFacade.error({
          message: cause.message,
        });
      });
    }
  }
}
