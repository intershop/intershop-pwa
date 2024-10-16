import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

import { SelectOption } from 'ish-core/models/select-option/select-option.model';
import { ariaDescribedByIds } from 'ish-shared/forms/utils/form-utils';

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
 * The select field functionality is coupled with the translate-select-options extension.
 * It reads the ``options`` and ``placeholder`` from the configuration and writes them to ``props.options``.
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

  get ariaDescribedByIds(): string | null {
    return ariaDescribedByIds(this.field.id, this.showError, this.props.customDescription);
  }
}
