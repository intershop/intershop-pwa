import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Wrapper that adds information text behind the input field.
 *
 * @props **customInformation** - used to define the information text. Can be one of two types:
 * * ``string`` : a simple string that will be translated and displayed
 * * ``{ key: string, args: any, class: string}`` : a more complex object containing a translation key
 *    and arguments to be translated as well as a class that will be applied to the information.
 *
 */
@Component({
  selector: 'ish-information-wrapper',
  templateUrl: './information-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, TranslateModule],
})
export class InformationWrapperComponent extends FieldWrapper implements OnInit {
  ngOnInit(): void {
    if (this.props.customInformation) {
      this.props.ariaDescribedByIds = `${this.field.id}-information`;
    }
  }

  get information() {
    return typeof this.props.customInformation === 'string'
      ? this.props.customInformation
      : this.props.customInformation?.key;
  }

  get args() {
    return typeof this.props.customInformation === 'string' ? {} : this.props.customInformation?.args;
  }
}
