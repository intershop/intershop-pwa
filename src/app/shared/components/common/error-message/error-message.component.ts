import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DirectivesModule } from 'ish-core/directives.module';

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
  standalone: true,
  imports: [NgIf, TranslateModule, DirectivesModule],
})
export class ErrorMessageComponent implements OnChanges {
  @Input({ required: true }) error: Partial<HttpError>;
  @Input() toast = true;

  constructor(private messageFacade: MessageFacade) {}

  ngOnChanges() {
    if (this.toast) {
      this.displayToast(this.error);
    }
  }

  private displayToast(err: Partial<HttpError>) {
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
