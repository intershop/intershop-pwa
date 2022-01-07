import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

/**
 * Component that displays either a cross or a check mark to indicate validity.
 *
 * @templateOption **showValidation** - a function of type ``(field: FormlyFieldConfig) => boolean``
 * that can be used to override the check mark display condition.
 *
 */
@Component({
  selector: 'ish-validation-icons',
  templateUrl: './validation-icons.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ValidationIconsComponent {
  @Input() field: FormlyFieldConfig;
  @Input() showError: boolean;

  defaultShowValidation() {
    return (
      this.field.formControl?.valid && (this.field.formControl?.dirty || this.field.options?.parentForm?.submitted)
    );
  }
}
