import { ChangeDetectionStrategy, Component, Input, OnChanges, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { MessageFacade } from 'ish-core/facades/message.facade';
import { HttpErrorHelper } from 'ish-core/models/http-error/http-error.helper';
import { HttpError } from 'ish-core/models/http-error/http-error.model';

/**
 * The Error Message Component displays an error message for an {@link HttpError}.
 * The ICM messages are rendered as sanitized HTML with escaped parameter values, see {@link HttpErrorHelper.formatMessage}.
 *
 * @example
   <ish-error-message [error]="error" />
 */
@Component({
  selector: 'ish-error-message',
  standalone: false,
  templateUrl: './error-message.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorMessageComponent implements OnChanges {
  @Input({ required: true }) error: Partial<HttpError>;
  @Input() toast = true;

  message: string;

  constructor(
    private messageFacade: MessageFacade,
    private sanitizer: DomSanitizer
  ) {}

  ngOnChanges() {
    if (this.toast) {
      this.displayToast(this.error);
    } else {
      // the ishServerHtml directive does not sanitize, so the message is sanitized here
      this.message = this.sanitizer.sanitize(SecurityContext.HTML, HttpErrorHelper.formatMessage(this.error));
    }
  }

  // toasts are sanitized by the toast service
  private displayToast(err: Partial<HttpError>) {
    if (!err) {
      return;
    }
    const messages = (err.errors ?? [])
      .map(feedback => HttpErrorHelper.formatFeedback(feedback))
      .filter(message => !!message);

    (messages.length ? messages : [err.message || err.code])
      .filter(message => !!message)
      .forEach(message => this.messageFacade.error({ message }));
  }
}
