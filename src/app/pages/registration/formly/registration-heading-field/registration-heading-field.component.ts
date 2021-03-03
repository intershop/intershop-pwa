import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

const sizes = ['h1', 'h2'];

@Component({
  selector: 'ish-registration-heading-field',
  templateUrl: './registration-heading-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationHeadingFieldComponent extends FieldType {
  dto = {
    headingSize: 'h1',
    showRequiredInfo: false,
  };

  get size() {
    return sizes.includes(this.to.headingSize) ? this.to.headingSize : this.dto.headingSize;
  }

  get showRequiredInfo() {
    return this.to.showRequiredInfo ?? this.dto.showRequiredInfo;
  }
}
