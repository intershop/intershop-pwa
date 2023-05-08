import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'ish-oci-configuration-form',
  templateUrl: './oci-configuration-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OciConfigurationFormComponent {
  form: FormGroup = new FormGroup({});
}
