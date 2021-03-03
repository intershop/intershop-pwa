import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'ish-description-wrapper',
  templateUrl: './description-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DescriptionWrapperComponent extends FieldWrapper {
  get description() {
    return typeof this.to.customDescription === 'string' ? this.to.customDescription : this.to.customDescription?.key;
  }

  get args() {
    return typeof this.to.customDescription === 'string' ? {} : this.to.customDescription?.args;
  }
}
