import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldArrayType, FormlyField } from '@ngx-formly/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ish-oci-configuration-mapping-repeat-field',
  imports: [FormlyField, TranslatePipe],
  standalone: true,
  templateUrl: './oci-configuration-mapping-repeat-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OciConfigurationMappingRepeatFieldComponent extends FieldArrayType {
  addRow() {
    this.add(this.model.length, { mapFromValue: '', mapToValue: '' });
  }
}
