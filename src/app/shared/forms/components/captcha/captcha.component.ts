import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, Validators } from '@angular/forms';

import { FeatureToggleService } from 'ish-core/feature-toggle.module';

/**
 * The Captcha Component
 *
 * Displays a captcha form control (V2) or widget (V3) if the captchaV2 or the captchaV3 feature is enabled.
 * It expects the given form to have the form controls for the captcha (controlName) and the captcha action (actionControlName).
 * If the captcha is confirmed the captcha form control contains the captcha response token provided by the captcha service.
 *
 * @example
 * <ish-captcha [form]="form" cssClass="offset-md-2 col-md-8"></ish-captcha>
 */
@Component({
  selector: 'ish-captcha',
  templateUrl: './captcha.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CaptchaComponent implements OnInit {
  /**
    form containing the captcha form controls
 */
  @Input() form: FormGroup;

  /**
    name of the captcha form control, default = 'captcha'
  */
  @Input() controlName = 'captcha';

  /**
    name of the captcha action form control, default = 'captchaAction'
  */
  @Input() actionControlName = 'captchaAction';

  /**
    css Class for rendering the captcha V2 control, default='offset-md-4 col-md-8'
  */
  @Input() cssClass = 'offset-md-4 col-md-8';

  captchaV2Enabled = false;
  captchaV3Enabled = false;

  constructor(private featureToggle: FeatureToggleService) {}

  ngOnInit() {
    this.initComponent();
  }

  initComponent() {
    this.captchaV2Enabled = this.featureToggle.enabled('captchaV2');
    this.captchaV3Enabled = this.featureToggle.enabled('captchaV3');

    /* check, if there is max only one captcha service enabled */
    if (this.captchaV2Enabled && this.captchaV3Enabled) {
      throw new Error('it is not allowed to enable more than one captcha service');
    }

    /* check, if required input parameters are available */
    if (this.isCaptchaEnabled()) {
      if (!this.form) {
        throw new Error('required input parameter <form> is missing for FormElementComponent');
      }
      if (!this.formControl) {
        throw new Error(
          `input parameter <controlName> with value '${this.controlName}' does not exist in the given form for CaptchaComponent`
        );
      }
      if (!this.actionFormControl) {
        throw new Error(
          `input parameter <controlName> with value '${this.actionControlName}' does not exist in the given form for CaptchaComponent`
        );
      }

      // set captcha field required
      this.formControl.setValidators([Validators.required]);
    }

    /* for captchaV2 the action is not needed, if the action is missing the service will send captcha in v2 format */
    if (this.captchaV2Enabled) {
      this.actionFormControl.setValue(undefined);
    }

    // for captcha V3 the action is required
    if (this.captchaV3Enabled) {
      this.actionFormControl.setValidators([Validators.required]);
    }
  }

  /**
   * get the captcha form control according to the controlName
   */
  get formControl(): AbstractControl {
    return this.form.get(this.controlName);
  }

  /**
   * get the captcha action form control according to the controlName
   */
  get actionFormControl(): AbstractControl {
    return this.form.get(this.actionControlName);
  }

  isCaptchaEnabled(): boolean {
    return this.captchaV2Enabled || this.captchaV3Enabled;
  }
}
