import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'ish-column-wrapper',
  templateUrl: './column-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnWrapperComponent extends FieldWrapper {
  get keyString() {
    return this.field.key as string;
  }
}
