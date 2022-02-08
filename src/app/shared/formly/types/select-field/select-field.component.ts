import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

import { SelectOption } from 'ish-core/models/select-option/select-option.model';

/**
 * Type for a basic select field
 *
 * @templateOption **options**  defines options to be shown as key value pairs. Accepts two types:
 * * `` { value: any; label: string}[]``
 * * `` Observable<{ value: any; label: string}[]>``
 * @templateOption **placeholder** defines the placeholder string that will be used as the first / default option
 *
 * @defaultWrappers form-field-horizontal & validation
 *
 * @usageNotes
 * The select field functionality is coupled with the translate-select-options extension. It reads the ``options`` and ``placeholder``
 * from the configuration and writes them to ``templateOptions.processedOptions``.
 * Please don't use ``templateOptions.processedOptions`` manually.
 *
 */
@Component({
  selector: 'ish-select-field',
  templateUrl: './select-field.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class SelectFieldComponent extends FieldType<FieldTypeConfig> {
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
