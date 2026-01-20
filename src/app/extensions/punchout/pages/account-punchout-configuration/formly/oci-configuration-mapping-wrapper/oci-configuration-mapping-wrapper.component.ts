import { NgClass, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldWrapper, FormlyModule } from '@ngx-formly/core';

import { IconModule } from 'ish-core/icon.module';

/**
 * The wrapper for displaying two input fields, a map from and a map to field.
 *
 */
@Component({
  selector: 'ish-oci-configuration-mapping-wrapper',
  templateUrl: './oci-configuration-mapping-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FormlyModule, NgClass, NgIf, IconModule],
})
export class OciConfigurationMappingWrapperComponent extends FieldWrapper {}
