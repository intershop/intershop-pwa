import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';
import { of } from 'rxjs';

/**
 * Wrapper to add input-addons to fields, using bootstrap styling.
 *
 *  @props **addonRight** - object of type ``{ text: string }`` or ``{ text: Observable<string> }`` that will be used to render an input addon to the right of the field.
 *  @props **addonLeft** - object of type ``{ text: string }`` or ``{ text: Observable<string> }`` that will be used to render an input addon to the left of the field.
 *
 */
@Component({
  selector: 'ish-input-addon-wrapper',
  templateUrl: './input-addon-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputAddonWrapperComponent extends FieldWrapper {
  get addonLeftText() {
    if (!this.props.addonLeft?.text) {
      return;
    }
    return typeof this.props.addonLeft.text === 'string' ? of(this.props.addonLeft.text) : this.props.addonLeft.text;
  }

  get addonRightText() {
    if (!this.props.addonRight?.text) {
      return;
    }
    return typeof this.props.addonRight.text === 'string' ? of(this.props.addonRight.text) : this.props.addonRight.text;
  }
}
