import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';

import { CaptchaV3Component } from './captcha-v3.component';

describe('Captcha V3 Component', () => {
  let component: CaptchaV3Component;
  let fixture: ComponentFixture<CaptchaV3Component>;
  let element: HTMLElement;
  const captchaSiteKey = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaptchaV3Component],
      imports: [RecaptchaV3Module],
      providers: [{ provide: RECAPTCHA_V3_SITE_KEY, useValue: captchaSiteKey }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaptchaV3Component);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.parentForm = new FormGroup({
      captcha: new FormControl(''),
      captchaAction: new FormControl(''),
    });
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
