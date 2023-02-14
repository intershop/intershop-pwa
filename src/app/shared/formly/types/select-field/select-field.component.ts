import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

import { SelectOption } from 'ish-core/models/select-option/select-option.model';

/**
 * Type for a basic select field
 *
 * @props **options**  defines options to be shown as key value pairs. Accepts two types:
 * * `` { value: any; label: string}[]``
 * * `` Observable<{ value: any; label: string}[]>``
 * @props **placeholder** defines the placeholder string that will be used as the first / default option
 *
 * @defaultWrappers form-field-horizontal & validation
 *
 * @usageNotes
 * The select field functionality is coupled with the translate-select-options extension. It reads the ``options`` and ``placeholder``
 * from the configuration and writes them to ``props.processedOptions``.
 * Please don't use ``props.processedOptions`` manually.
 *
 */
@Component({
  selector: 'ish-select-field',
  templateUrl: './select-field.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class SelectFieldComponent extends FieldType<FieldTypeConfig> {
  defaultOptions = {
    props: {
      options: [] as SelectOption[],
      compareWith(o1: unknown, o2: unknown) {
        return o1 === o2;
      },
    },
  };

  get selectOptions() {
    return this.props.processedOptions ?? this.props.options;
  }
}
