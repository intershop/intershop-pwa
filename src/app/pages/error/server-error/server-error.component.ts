import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

/**
 * The Server Error Page Component informs the user about an occurred error on server side.
 *
 * @example
 * <ish-server-error-page
 *               [error]="generalError"
 * ></ish-server-error-page>
 */
@Component({
  selector: 'ish-server-error',
  templateUrl: './server-error.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServerErrorComponent {
  /**
   * The occured error.
   */
  @Input() error: HttpError | string;
  @Input() type: string;

  expanded = false;

  get httpError() {
    return this.error as HttpError;
  }

  get stringError() {
    return this.error as string;
  }

  expand() {
    this.expanded = true;
  }
}
