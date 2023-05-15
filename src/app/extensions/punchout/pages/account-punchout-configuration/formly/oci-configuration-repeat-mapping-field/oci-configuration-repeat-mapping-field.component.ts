import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldArrayType } from '@ngx-formly/core';

@Component({
  selector: 'ish-oci-configuration-repeat-mapping-field',
  templateUrl: './oci-configuration-repeat-mapping-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OciConfigurationRepeatMappingFieldComponent extends FieldArrayType {}
