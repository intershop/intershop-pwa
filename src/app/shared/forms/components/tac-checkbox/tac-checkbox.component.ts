import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'ish-tac-checkbox',
  templateUrl: './tac-checkbox.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TacCheckboxComponent {
  @Input() form: FormGroup;
}
