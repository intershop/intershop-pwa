import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldArrayType } from '@ngx-formly/core';

@Component({
  selector: 'ish-oci-configuration-mapping-repeat-field',
  templateUrl: './oci-configuration-mapping-repeat-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OciConfigurationMappingRepeatFieldComponent extends FieldArrayType {}
