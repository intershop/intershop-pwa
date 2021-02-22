import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'ish-registration-buttons-field',
  templateUrl: './registration-buttons-field.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class RegistrationButtonsFieldComponent extends FieldType {
  cancelForm() {
    if (this.to.onCancel) {
      this.to.onCancel();
    }
  }
}
