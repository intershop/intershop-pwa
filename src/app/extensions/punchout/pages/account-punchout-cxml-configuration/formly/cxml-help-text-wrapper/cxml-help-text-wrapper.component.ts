import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

/**
 * Wrapper that adds a help text under an cxml configuration value. The help text can be collapsed.
 *
 * @props **helpText** - used to define the help text.
 */
@Component({
  selector: 'ish-cxml-help-text-wrapper',
  templateUrl: './cxml-help-text-wrapper.component.html',
  styleUrls: ['./cxml-help-text-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CxmlHelpTextWrapperComponent extends FieldWrapper {
  isCollapsed = false;

  get helpText() {
    return this.props.helpText;
  }
}
