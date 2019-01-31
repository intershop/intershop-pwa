import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'ish-registration-company-form',
  templateUrl: './registration-company-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationCompanyFormComponent {
  @Input()
  customerForm: FormGroup;
}
