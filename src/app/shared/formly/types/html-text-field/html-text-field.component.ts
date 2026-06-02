import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

/**
 * Type to display a html text value with optional styling
 *
 * @props **inputClass** a class that will be used to style the div around the text
 */
@Component({
  selector: 'ish-html-text-field',
  templateUrl: './html-text-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
})
export class HtmlTextFieldComponent extends FieldType {
  get textValue() {
    return this.form.get(this.field.key as string)?.value;
  }
}
