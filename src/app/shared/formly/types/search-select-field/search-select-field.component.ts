import { AsyncPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';
import { FormlySelectOptionsPipe } from '@ngx-formly/core/select';

import { SelectOption } from 'ish-core/models/select-option/select-option.model';

/**
 * Type for a searchable select field
 */

@Component({
  selector: 'ish-search-select-field',
  imports: [AsyncPipe, FormlySelectOptionsPipe, NgClass, NgSelectModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './search-select-field.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class SearchSelectFieldComponent extends FieldType<FieldTypeConfig> {
  defaultOptions = {
    props: {
      options: [] as SelectOption[],
    },
  };
}
