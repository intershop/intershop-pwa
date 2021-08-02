import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

/**
 * Wrapper that adds a small description underneath the field.
 *
 * @templateOption **customDescription** - used to define the description text. Can be one of two types:
 * * ``string`` : a simple string that will be translated and displayed
 * * ``{ key: string, args: any, class: string}`` : a more complex object containing a translation key
 *    and arguments to be translated as well as a class that will be applied to the description.
 *
 */
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
