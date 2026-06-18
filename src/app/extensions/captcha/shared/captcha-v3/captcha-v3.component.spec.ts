import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MockDirective } from 'ng-mocks';
import { RECAPTCHA_V3_SITE_KEY, ReCaptchaV3Service, RecaptchaV3Module } from 'ng-recaptcha-2';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

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
      [
        "recaptcha-v3-info",
      ]
    `);
  });

  it('should set captchaAction validators on init', () => {
    fixture.detectChanges();
    const captchaAction = component.parentForm.get('captchaAction');
    captchaAction.setValue('');
    captchaAction.updateValueAndValidity();
    expect(captchaAction.valid).toBeFalse();
  });
});

@Component({
  template: `<form [formGroup]="form"><ish-captcha-v3 [parentForm]="form" /></form>`,
})
class WrapperComponent {
  @ViewChild(CaptchaV3Component) captchaComponent: CaptchaV3Component;
  form = new FormGroup({
    captcha: new FormControl(''),
    captchaAction: new FormControl('testAction'),
  });
}

describe('Captcha V3 Component', () => {
  let wrapperFixture: ComponentFixture<WrapperComponent>;
  let wrapper: WrapperComponent;
  let recaptchaV3Service: ReCaptchaV3Service;
  const captchaSiteKey = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

  beforeEach(async () => {
    recaptchaV3Service = mock(ReCaptchaV3Service);
    when(recaptchaV3Service.execute('testAction')).thenReturn(of('mock-token-123'));

    await TestBed.configureTestingModule({
      declarations: [CaptchaV3Component, MockDirective(ServerHtmlDirective), WrapperComponent],
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
      providers: [
        { provide: RECAPTCHA_V3_SITE_KEY, useValue: captchaSiteKey },
        { provide: ReCaptchaV3Service, useFactory: () => instance(recaptchaV3Service) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    wrapperFixture = TestBed.createComponent(WrapperComponent);
    wrapper = wrapperFixture.componentInstance;
    wrapperFixture.detectChanges();
  });

  it('should block initial submit and fetch a token', fakeAsync(() => {
    const formElement: HTMLFormElement = wrapperFixture.nativeElement.querySelector('form');
    const ngSubmitSpy = jest.fn();
    formElement.addEventListener('submit', ngSubmitSpy);

    formElement.requestSubmit();
    tick();

    expect(wrapper.form.get('captcha').value).toEqual('mock-token-123');
  }));

  it('should re-trigger submit after token is set', fakeAsync(() => {
    const formElement: HTMLFormElement = wrapperFixture.nativeElement.querySelector('form');
    let submitCount = 0;
    formElement.addEventListener('submit', () => submitCount++);

    formElement.requestSubmit();
    tick();

    // First submit is blocked, second submit passes through after token is ready
    expect(submitCount).toBeGreaterThanOrEqual(1);
    expect(wrapper.form.get('captcha').value).toEqual('mock-token-123');
  }));

  it('should set captcha token value in the parent form', fakeAsync(() => {
    const formElement: HTMLFormElement = wrapperFixture.nativeElement.querySelector('form');

    expect(wrapper.form.get('captcha').value).toBeEmpty();

    formElement.requestSubmit();
    tick();

    expect(wrapper.form.get('captcha').value).toEqual('mock-token-123');
  }));

  it('should fetch a fresh token on every submit', fakeAsync(() => {
    const formElement: HTMLFormElement = wrapperFixture.nativeElement.querySelector('form');

    formElement.requestSubmit();
    tick();

    expect(wrapper.form.get('captcha').value).toEqual('mock-token-123');

    // Reset captcha and submit again
    wrapper.form.get('captcha').setValue('');
    when(recaptchaV3Service.execute('testAction')).thenReturn(of('mock-token-456'));

    formElement.requestSubmit();
    tick();

    expect(wrapper.form.get('captcha').value).toEqual('mock-token-456');
  }));
});
