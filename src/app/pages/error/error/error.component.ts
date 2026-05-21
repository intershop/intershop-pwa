import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The Error Page Component informs the user that the server returned an error.
 * It uses the {@link SearchBoxComponent}.
 *
 * @example
 * <ish-error-page />
 */
@Component({
  selector: 'ish-error',
  standalone: false,
  templateUrl: './error.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorComponent {}
