import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FormlyField, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'ish-radio-buttons-field',
  templateUrl: './radio-buttons-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioButtonsFieldComponent extends FieldType {
  get entries(): (FormlyFieldConfig | { value: string; label: string })[] {
    return this.field.fieldGroup.map(field =>
      field.type ? field : { value: field.id, label: field.templateOptions.label ?? '' }
    );
  }

  isFormlyFieldConfig(entry: FormlyFieldConfig | { value: string; label: string }): entry is FormlyFieldConfig {
    return Object.keys(entry).filter(key => key !== 'value' && key !== 'label').length > 0;
  }

  asKeyValuePair(entry: FormlyFieldConfig | { value: string; label: string }): { value: string; label: string } {
    return entry as { value: string; label: string };
  }
}
