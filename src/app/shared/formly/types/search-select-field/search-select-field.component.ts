import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

import { SelectOption } from 'ish-core/models/select-option/select-option.model';

/**
 * Type for a searchable select field
 */

@Component({
  selector: 'ish-search-select-field',
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
