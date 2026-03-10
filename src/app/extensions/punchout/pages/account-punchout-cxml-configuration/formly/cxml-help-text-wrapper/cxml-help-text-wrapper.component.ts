import { NgClass, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { FieldWrapper } from '@ngx-formly/core';
import { TranslatePipe } from '@ngx-translate/core';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';

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
  standalone: true,
  imports: [NgbCollapseModule, ServerHtmlDirective, NgIf, NgClass, TranslatePipe],
})
export class CxmlHelpTextWrapperComponent extends FieldWrapper {
  isCollapsed = false;

  get helpText() {
    return this.props.helpText;
  }
}
