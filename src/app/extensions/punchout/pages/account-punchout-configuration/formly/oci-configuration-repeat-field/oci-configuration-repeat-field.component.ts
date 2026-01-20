import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldArrayType, FormlyModule } from '@ngx-formly/core';

@Component({
  selector: 'ish-oci-configuration-repeat-field',
  templateUrl: './oci-configuration-repeat-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FormlyModule, NgFor],
})
export class OciConfigurationRepeatFieldComponent extends FieldArrayType {}
