// NEEDS_WORK: DUMMY COMPONENT
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ish-error-page',
  templateUrl: './error-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorPageComponent {
  // TODO: do not handle complete ErrorState, model type might be required
  @Input() error;
}
