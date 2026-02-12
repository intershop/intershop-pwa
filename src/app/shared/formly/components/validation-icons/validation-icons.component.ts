import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { IconModule } from 'ish-core/icon.module';

/**
 * Component that displays either a cross or a check mark to indicate validity.
 *
 * @props **showValidation** - a function of type ``(field: FormlyFieldConfig) => boolean``
 * that can be used to override the check mark display condition.
 *
 */
@Component({
  selector: 'ish-validation-icons',
  templateUrl: './validation-icons.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: true,
  imports: [CommonModule, IconModule],
})
export class ValidationIconsComponent {
  @Input({ required: true }) field: FormlyFieldConfig;
  @Input() showError: boolean;

  defaultShowValidation() {
    return (
      this.field.formControl?.valid && (this.field.formControl?.dirty || this.field.options?.parentForm?.submitted)
    );
  }
}
