import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Compiler,
  Component,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { AbstractControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { switchMapTo, take, takeUntil } from 'rxjs/operators';

import { whenTruthy } from 'ish-core/utils/operators';

import { CaptchaFacade, CaptchaTopic } from '../../facades/captcha.facade';

/**
 * The Captcha Component
 *
 * Displays a captcha form control (V2) or widget (V3) if the captchaV2 or the captchaV3 feature is enabled.
 * It expects the given form to have the form controls for the captcha (controlName) and the captcha action (actionControlName).
 * If the captcha is confirmed the captcha form control contains the captcha response token provided by the captcha service.
 *
 * The parent form supplied must have controls for 'captcha' and 'captchaAction'
 *
 * @example
 * <ish-lazy-captcha [form]="form" cssClass="offset-md-2 col-md-8" topic="contactUs"></ish-lazy-captcha>
 */
@Component({
  selector: 'ish-lazy-captcha',
  templateUrl: './lazy-captcha.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class LazyCaptchaComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('anchor', { read: ViewContainerRef, static: true }) anchor: ViewContainerRef;

  /**
    form containing the captcha form controls
 */
  @Input() form: FormGroup;

  /**
    css Class for rendering the captcha V2 control, default='offset-md-4 col-md-8'
  */
  @Input() cssClass = 'offset-md-4 col-md-8';

  @Input() topic: CaptchaTopic;

  private destroy$ = new Subject();

  constructor(private captchaFacade: CaptchaFacade, private compiler: Compiler, private injector: Injector) {}

  ngOnInit() {
    this.sanityCheck();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit() {
    this.captchaFacade
      .captchaActive$(this.topic)
      .pipe(
        whenTruthy(),
        switchMapTo(this.captchaFacade.captchaVersion$),
        whenTruthy(),
        take(1),
        takeUntil(this.destroy$)
      )
      .subscribe(async version => {
        if (version === 3) {
          this.actionFormControl.setValue(this.topic);

          const { CaptchaV3Component, CaptchaV3ComponentModule } = await import(
            '../../shared/captcha-v3/captcha-v3.component'
          );
          const moduleFactory = await this.compiler.compileModuleAsync(CaptchaV3ComponentModule);
          const moduleRef = moduleFactory.create(this.injector);
          const factory = moduleRef.componentFactoryResolver.resolveComponentFactory(CaptchaV3Component);

          const componentRef = this.anchor.createComponent(factory);

          componentRef.instance.parentForm = this.form;
          componentRef.changeDetectorRef.markForCheck();
        } else if (version === 2) {
          this.formControl.setValidators([Validators.required]);
          this.formControl.updateValueAndValidity();

          const { CaptchaV2Component, CaptchaV2ComponentModule } = await import(
            '../../shared/captcha-v2/captcha-v2.component'
          );
          const moduleFactory = await this.compiler.compileModuleAsync(CaptchaV2ComponentModule);
          const moduleRef = moduleFactory.create(this.injector);
          const factory = moduleRef.componentFactoryResolver.resolveComponentFactory(CaptchaV2Component);

          const componentRef = this.anchor.createComponent(factory);

          componentRef.instance.cssClass = this.cssClass;
          componentRef.instance.parentForm = this.form;
          componentRef.changeDetectorRef.markForCheck();
        }
      });
  }

  private sanityCheck() {
    if (!this.form) {
      throw new Error('required input parameter <form> is missing for LazyCaptchaComponent');
    }
    if (!this.formControl) {
      throw new Error(`form control 'captcha' does not exist in the given form for LazyCaptchaComponent`);
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
