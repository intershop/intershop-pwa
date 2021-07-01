import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'ish-radio-field',
  templateUrl: './radio-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioFieldComponent extends FieldType {
  formControl: FormControl;
}
