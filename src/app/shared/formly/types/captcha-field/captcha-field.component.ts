import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup } from '@angular/forms';
import { FieldType } from '@ngx-formly/core';

/**
 * Type to include the ``ish-lazy-captcha`` component in your fields.
 *
 * @props **topic** - defines the captcha topic that is passed to the component.
 *
 * @usageNotes
 * Automatically adds the required ``captcha`` and ``captchaAction`` FormControls to the form.
 * Refer to the ``ish-lazy-captcha`` component for more details.
 */
@Component({
  selector: 'ish-captcha-field',
  standalone: false,
  templateUrl: './captcha-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaptchaFieldComponent extends FieldType implements OnInit {
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.registerControls();
    this.syncFieldControl();
  }

  /**
   * Formly creates a separate form control for this field (it has no key), which is used to display the validation message.
   * Its value is kept in sync with the ``captcha`` form control so the 'required' error disappears once the captcha is solved.
   */
  private syncFieldControl() {
    const captchaControl = this.form.get('captcha');
    if (!this.formControl || this.formControl === captchaControl) {
      return;
    }

    captchaControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => this.formControl.setValue(value));
  }

  private registerControls() {
    const form = this.form as FormGroup;
    if (!form.get('captcha')) {
      form.addControl('captcha', new FormControl(''));
    }

    if (!form.get('captchaAction')) {
      form.addControl('captchaAction', new FormControl(this.props.topic));
    }
  }
}
