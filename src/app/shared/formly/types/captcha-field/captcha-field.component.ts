import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FieldType } from '@ngx-formly/core';

/**
 * Type to include the ``ish-lazy-captcha`` component in your fields.
 *
 * @props **topic** - defines the captcha topic that is passed to the component.
 *
 * @usageNotes
 * The field type uses ``captcha`` as default key, so Formly registers the field's FormControl as ``captcha`` FormControl in the form.
 * This way the field validation (e.g. 'required') applies to the CAPTCHA response token.
 * The ``captchaAction`` FormControl is added to the form automatically.
 * Refer to the ``ish-lazy-captcha`` component for more details.
 */
@Component({
  selector: 'ish-captcha-field',
  standalone: false,
  templateUrl: './captcha-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaptchaFieldComponent extends FieldType implements OnInit {
  ngOnInit() {
    const form = this.form as FormGroup;
    if (!form.get('captchaAction')) {
      form.addControl('captchaAction', new FormControl(this.props.topic));
    }
  }
}
