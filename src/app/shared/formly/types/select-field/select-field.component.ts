import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FieldType } from '@ngx-formly/core';

import { SelectOption } from 'ish-shared/forms/components/select/select.component';

@Component({
  selector: 'ish-select-field',
  templateUrl: './select-field.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class SelectFieldComponent extends FieldType {
  formControl: FormControl;
  defaultOptions = {
    templateOptions: {
      options: [] as SelectOption[],
      compareWith(o1: unknown, o2: unknown) {
        return o1 === o2;
      },
    },
  };

  get selectOptions() {
    return this.to.processedOptions ?? this.to.options;
  }
}
