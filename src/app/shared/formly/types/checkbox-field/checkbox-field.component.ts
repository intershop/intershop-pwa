import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

import { ariaDescribedByIds } from 'ish-shared/forms/utils/form-utils';

/**
 * Type for a basic checkbox field.
 *
 * @props **ariaLabel** adds an aria-label to the component for better accessibility, recommended if there is no associated label
 *
 * @defaultWrappers form-field-checkbox-horizontal
 *
 * @usageNotes
 * Refer to the form-field-checkbox-horizontal wrapper for more info on relevant props.
 */
@Component({
  selector: 'ish-checkbox-field',
  templateUrl: './checkbox-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxFieldComponent extends FieldType<FieldTypeConfig> {
  get ariaDescribedByIds(): string | null {
    return ariaDescribedByIds(this.field.id, this.showError, this.props.customDescription);
  }
}
