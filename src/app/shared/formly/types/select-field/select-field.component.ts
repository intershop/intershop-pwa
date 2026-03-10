import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldType, FieldTypeConfig, FormlyAttributes } from '@ngx-formly/core';
import { FormlySelectModule } from '@ngx-formly/core/select';
import { TranslatePipe } from '@ngx-translate/core';

import { SelectOption } from 'ish-core/models/select-option/select-option.model';

/**
 * Type for a basic select field
 *
 * @props **options**  defines options to be shown as key value pairs. Accepts two types:
 * * `` { value: any; label: string}[]``
 * * `` Observable<{ value: any; label: string}[]>``
 * @props **placeholder** defines the placeholder string that will be used as the first / default option
 * @props **optionsTranslateDisabled** - disables options label translation (placeholder is still translated)
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
  standalone: true,
  imports: [CommonModule, FormlyAttributes, FormlySelectModule, ReactiveFormsModule, TranslatePipe],
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
}
