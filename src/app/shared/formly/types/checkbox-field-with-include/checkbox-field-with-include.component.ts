import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
  selector: 'ish-form-checkbox-with-include',
  templateUrl: './checkbox-field-with-include.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxFieldWithIncludeComponent extends FieldType<FieldTypeConfig> {}
