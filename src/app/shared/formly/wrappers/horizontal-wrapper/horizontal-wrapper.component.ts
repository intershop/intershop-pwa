import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'ish-horizontal-wrapper',
  templateUrl: './horizontal-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class HorizontalWrapperComponent extends FieldWrapper {
  dto = {
    labelClass: 'col-md-4',
    fieldClass: 'col-md-8',
  };
  get keyString() {
    return this.field.key as string;
  }
}
