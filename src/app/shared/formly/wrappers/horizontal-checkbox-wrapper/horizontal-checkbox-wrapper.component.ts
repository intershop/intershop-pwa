import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'ish-horizontal-checkbox-wrapper',
  templateUrl: './horizontal-checkbox-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class HorizontalCheckboxWrapperComponent extends FieldWrapper {
  dto = {
    labelClass: '',
    fieldClass: 'offset-md-4 col-md-8',
  };
  get keyString() {
    return this.field.key as string;
  }
}
