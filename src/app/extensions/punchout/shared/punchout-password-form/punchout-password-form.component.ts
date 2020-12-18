import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'ish-punchout-password-form',
  templateUrl: './punchout-password-form.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class PunchoutPasswordFormComponent {
  @Input() form: FormGroup;
}
