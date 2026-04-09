import { JsonPipe, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { HttpError } from 'ish-core/models/http-error/http-error.model';

/**
 * The Server Error Page Component informs the user about an occurred error on server side.
 *
 * @example
 * <ish-server-error-page [error]="generalError" />
 */
@Component({
  selector: 'ish-server-error',
  templateUrl: './server-error.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TranslatePipe, NgSwitch, ServerHtmlDirective, NgSwitchCase, NgSwitchDefault, JsonPipe],
})
export class ServerErrorComponent {
  /**
   * The occurred error.
   */
  @Input({ required: true }) error: HttpError | string;
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
