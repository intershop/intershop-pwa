import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'ish-radio-textinput-field',
  templateUrl: './radio-textinput-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioTextinputFieldComponent extends FieldType {}
