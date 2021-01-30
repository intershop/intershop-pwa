import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MockDirective } from 'ng-mocks';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { findAllDataTestingIDs } from 'ish-core/utils/dev/html-query-utils';

import { CaptchaV3Component } from './captcha-v3.component';

describe('Captcha V3 Component', () => {
  let component: CaptchaV3Component;
  let fixture: ComponentFixture<CaptchaV3Component>;
  let element: HTMLElement;
  const captchaSiteKey = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaptchaV3Component, MockDirective(ServerHtmlDirective)],
      imports: [RecaptchaV3Module, TranslateModule.forRoot()],
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

  it('should render recaptcha info text when created', () => {
    fixture.detectChanges();
    expect(findAllDataTestingIDs(fixture)).toMatchInlineSnapshot(`
      Array [
        "recaptcha-v3-info",
      ]
    `);
  });
});
