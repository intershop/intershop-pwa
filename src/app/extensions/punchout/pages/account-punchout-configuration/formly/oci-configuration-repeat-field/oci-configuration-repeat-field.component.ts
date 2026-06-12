import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldArrayType } from '@ngx-formly/core';

@Component({
  selector: 'ish-oci-configuration-repeat-field',
  templateUrl: './oci-configuration-repeat-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OciConfigurationRepeatFieldComponent extends FieldArrayType {}
