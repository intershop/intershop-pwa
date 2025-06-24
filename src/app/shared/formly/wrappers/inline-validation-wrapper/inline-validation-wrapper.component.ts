import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'ish-inline-validation-wrapper',
  templateUrl: './inline-validation-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class InlineValidationWrapperComponent extends FieldWrapper {
  showValidationIcons() {
    return (
      Object.keys(this.field.validators ?? {}).length ||
      Object.keys(this.field.asyncValidators ?? {}).length ||
      this.field.props?.required
    );
  }
}
