import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'ish-punchout-user-form',
  templateUrl: './punchout-user-form.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class PunchoutUserFormComponent {
  @Input() form: FormGroup;
  @Input() update = false;
}
