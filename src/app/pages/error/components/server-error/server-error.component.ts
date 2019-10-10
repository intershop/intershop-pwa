import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

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
  // TODO: do not handle complete ErrorState, model type might be required
  /**
   * The occured error.
   */
  @Input() error;
}
