import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'ish-punchout-login-form',
  templateUrl: './punchout-login-form.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class PunchoutLoginFormComponent {
  @Input() form: FormGroup;
}
