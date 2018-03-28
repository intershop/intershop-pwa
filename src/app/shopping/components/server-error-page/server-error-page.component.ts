// NEEDS_WORK: DUMMY COMPONENT
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ish-server-error-page',
  templateUrl: './server-error-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServerErrorPageComponent {

  // TODO: do not handle complete ErrorState, model type might be required
  @Input() error;
}
