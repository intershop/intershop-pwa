import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

/**
 * The wrapper for displaying two input fields, a map from and a map to field.
 *
 */
@Component({
  selector: 'ish-oci-configuration-mapping-wrapper',
  templateUrl: './oci-configuration-mapping-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OciConfigurationMappingWrapperComponent extends FieldWrapper {}
