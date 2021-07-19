import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'ish-radio-button-fieldgroup-wrapper',
  templateUrl: './radio-button-fieldgroup-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioButtonFieldgroupWrapperComponent extends FieldWrapper {
  get fc() {
    return this.formControl as FormControl;
  }
}
