import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'ish-textarea-field',
  templateUrl: './textarea-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaFieldComponent extends FieldType {
  formControl: FormControl;

  defaultOptions = {
    templateOptions: {
      cols: 1,
      rows: 1,
    },
  };
}
