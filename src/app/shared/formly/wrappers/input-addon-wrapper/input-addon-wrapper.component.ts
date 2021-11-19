import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';
import { of } from 'rxjs';

/**
 * Wrapper to add input-addons to fields, using bootstrap styling.
 *
 *  @templateOption **addonRight** - object of type ``{ text: string }`` or ``{ text: Observable<string> }`` that will be used to render an input addon to the right of the field.
 *  @templateOption **addonLeft** - object of type ``{ text: string }`` or ``{ text: Observable<string> }`` that will be used to render an input addon to the left of the field.
 *
 */
@Component({
  selector: 'ish-input-addon-wrapper',
  templateUrl: './input-addon-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputAddonWrapperComponent extends FieldWrapper {
  get addonLeftText() {
    if (!this.to.addonLeft?.text) {
      return;
    }
    return typeof this.to.addonLeft.text === 'string' ? of(this.to.addonLeft.text) : this.to.addonLeft.text;
  }

  get addonRightText() {
    if (!this.to.addonRight?.text) {
      return;
    }
    return typeof this.to.addonRight.text === 'string' ? of(this.to.addonRight.text) : this.to.addonRight.text;
  }
}
