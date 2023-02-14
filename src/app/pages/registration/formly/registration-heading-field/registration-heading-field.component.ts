import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

const sizes = ['h1', 'h2'];

/**
 * Type that displays a section heading.
 *
 * @props **heading** the primary heading text. Will be translated.
 * @props **subheading** the secondary heading text. Wil be translated.
 * @props **headingSize** determines whether the heading should be rendered with an <h1> or <h2> tag.
 * @props **showRequiredInfo** determines whether a message explaining the required star should be shown.
 */
@Component({
  selector: 'ish-registration-heading-field',
  templateUrl: './registration-heading-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationHeadingFieldComponent extends FieldType {
  dto = {
    headingSize: 'h1',
    showRequiredInfo: false,
  };

  get size() {
    return sizes.includes(this.props.headingSize) ? this.props.headingSize : this.dto.headingSize;
  }

  get showRequiredInfo() {
    return this.props.showRequiredInfo ?? this.dto.showRequiredInfo;
  }
}
