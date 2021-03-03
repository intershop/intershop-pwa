import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'ish-fieldset-field',
  templateUrl: './fieldset-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldsetFieldComponent extends FieldType {}
