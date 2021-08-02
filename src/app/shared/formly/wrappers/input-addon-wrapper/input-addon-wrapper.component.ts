import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

/**
 * Wrapper to add input-addons to fields, using bootstrap styling.
 *
 *  @templateOption **addonRight** - object of type ``{ text: string }`` that will be used to render an input addon to the right of the field.
 *  @templateOption **addonLeft** - object of type ``{ text: string }`` that will be used to render an input addon to the left of the field.
 *
 */
@Component({
  selector: 'ish-input-addon-wrapper',
  templateUrl: './input-addon-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputAddonWrapperComponent extends FieldWrapper {}
