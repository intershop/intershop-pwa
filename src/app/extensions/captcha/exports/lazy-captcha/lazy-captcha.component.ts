import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Injector,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef,
  createNgModule,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { switchMap, take } from 'rxjs/operators';

import { whenTruthy } from 'ish-core/utils/operators';

import { CaptchaFacade, CaptchaTopic } from '../../facades/captcha.facade';

/**
 * The Captcha Component
 *
 * Displays a captcha form control (V2) or info text (V3) if the captchaV2 or the captchaV3 feature is enabled.
 * For V3, the token is fetched by the ApiService when the request is made.
 * For V2, it expects the form to have a 'captchaAction' control. The 'captcha' control is added dynamically.
 *
 * The parent form supplied must have a control for 'captchaAction'
 *
 * @example
 * <ish-lazy-captcha cssClass="offset-md-2 col-md-8" topic="contactUs" [form]="form" />
 */
@Component({
  selector: 'ish-lazy-captcha',
  templateUrl: './lazy-captcha.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class LazyCaptchaComponent implements OnInit, AfterViewInit {
  @ViewChild('anchor', { read: ViewContainerRef, static: true }) anchor: ViewContainerRef;

  /**
    form containing the captcha form controls
   */
  @Input({ required: true }) form: FormGroup | FormArray;

  @Input({ required: true }) topic: CaptchaTopic;

  /**
    css Class for rendering the captcha V2 control, default='offset-md-4 col-md-8'
   */
  @Input() cssClass = '';

  private destroyRef = inject(DestroyRef);

  constructor(
    private captchaFacade: CaptchaFacade,
    private injector: Injector
  ) {}

  ngOnInit() {
    this.sanityCheck();
  }

  ngAfterViewInit() {
    this.captchaFacade
      .captchaActive$(this.topic)
      .pipe(
        whenTruthy(),
        switchMap(() => this.captchaFacade.captchaVersion$),
        whenTruthy(),
        take(1),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(async version => {
        if (version === 3) {
          this.actionFormControl.setValue(this.topic);

          // eslint-disable-next-line @typescript-eslint/naming-convention
          const { CaptchaV3Component, CaptchaV3ComponentModule } =
            await import('../../shared/captcha-v3/captcha-v3.component');

          const moduleRef = createNgModule(CaptchaV3ComponentModule, this.injector);
          this.anchor.createComponent(CaptchaV3Component, { ngModuleRef: moduleRef });
        } else if (version === 2) {
          this.ensureCaptchaFormControl();
          this.formControl.setValidators([Validators.required]);
          this.formControl.updateValueAndValidity();

          // eslint-disable-next-line @typescript-eslint/naming-convention
          const { CaptchaV2Component, CaptchaV2ComponentModule } =
            await import('../../shared/captcha-v2/captcha-v2.component');

          const moduleRef = createNgModule(CaptchaV2ComponentModule, this.injector);
          const componentRef = this.anchor.createComponent(CaptchaV2Component, { ngModuleRef: moduleRef });

          componentRef.instance.cssClass = this.cssClass;
          componentRef.instance.parentForm = this.form as FormGroup;
          componentRef.changeDetectorRef.markForCheck();
        }
      });
  }

  private ensureCaptchaFormControl() {
    const form = this.form as FormGroup;
    if (!form.get('captcha')) {
      form.addControl('captcha', new FormControl(''));
    }
  }

  private sanityCheck() {
    if (!this.form) {
      throw new Error('required input parameter <form> is missing for LazyCaptchaComponent');
    }
    if (!this.actionFormControl) {
      throw new Error(`form control 'captchaAction' does not exist in the given form for LazyCaptchaComponent`);
    }
    if (!this.topic) {
      throw new Error(`required input parameter <topic> is missing for LazyCaptchaComponent`);
    }
  }

  private get formControl(): AbstractControl {
    return this.form?.get('captcha');
  }

  private get actionFormControl(): AbstractControl {
    return this.form?.get('captchaAction');
  }
}
