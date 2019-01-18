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
  selector: 'ish-server-error-page',
  templateUrl: './server-error-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServerErrorPageComponent {
  // TODO: do not handle complete ErrorState, model type might be required
  /**
   * The occured error.
   */
  @Input() error;
}
