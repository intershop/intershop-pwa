import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'ish-checkbox-field',
  templateUrl: './checkbox-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxFieldComponent extends FieldType {
  formControl: FormControl;
}
