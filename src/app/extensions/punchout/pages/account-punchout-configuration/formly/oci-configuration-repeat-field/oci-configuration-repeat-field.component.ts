import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldArrayType, FormlyField } from '@ngx-formly/core';

@Component({
  selector: 'ish-oci-configuration-repeat-field',
  imports: [FormlyField],
  standalone: true,
  templateUrl: './oci-configuration-repeat-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OciConfigurationRepeatFieldComponent extends FieldArrayType {}
