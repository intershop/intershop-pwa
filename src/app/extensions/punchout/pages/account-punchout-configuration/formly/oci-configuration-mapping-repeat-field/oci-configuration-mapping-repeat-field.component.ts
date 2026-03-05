import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldArrayType, FormlyModule } from '@ngx-formly/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ish-oci-configuration-mapping-repeat-field',
  templateUrl: './oci-configuration-mapping-repeat-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FormlyModule, TranslatePipe, NgFor],
})
export class OciConfigurationMappingRepeatFieldComponent extends FieldArrayType {
  addRow() {
    this.add(this.model.length, { mapFromValue: '', mapToValue: '' });
  }
}
