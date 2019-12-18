import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

/**
 * The Error Message Component displays an error message for an Http error.
 *
 * @example
   <ish-error-message [error]="error">Please retry your last action.</ish-error-message>
 */
@Component({
  selector: 'ish-error-message',
  templateUrl: './error-message.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorMessageComponent {
  @Input() error: HttpError;
}
