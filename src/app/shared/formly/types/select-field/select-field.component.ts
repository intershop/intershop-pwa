import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'ish-select-field',
  templateUrl: './select-field.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class SelectFieldComponent extends FieldType {
  formControl: FormControl;
  defaultOptions = {
    templateOptions: {
      options: [],
      compareWith(o1, o2) {
        return o1 === o2;
      },
    },
  };

  get selectOptions() {
    return this.to.processedOptions ?? this.to.options;
  }
}
