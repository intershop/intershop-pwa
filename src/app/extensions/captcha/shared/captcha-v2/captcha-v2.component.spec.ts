import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RecaptchaModule } from 'ng-recaptcha';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { CaptchaFacade } from '../../facades/captcha.facade';

import { CaptchaV2Component } from './captcha-v2.component';

describe('Captcha V2 Component', () => {
  let component: CaptchaV2Component;
  let fixture: ComponentFixture<CaptchaV2Component>;
  let element: HTMLElement;

  beforeEach(async () => {
    const captchaFacade = mock(CaptchaFacade);
    when(captchaFacade.captchaSiteKey$).thenReturn(of('captchaV2SiteKey'));

    await TestBed.configureTestingModule({
      declarations: [CaptchaV2Component],
      imports: [ReactiveFormsModule, RecaptchaModule, TranslateModule.forRoot()],
      providers: [{ provide: CaptchaFacade, useFactory: () => instance(captchaFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaptchaV2Component);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    const fb = TestBed.inject(FormBuilder);
    component.parentForm = fb.group({
      captcha: fb.control(''),
      captchaAction: fb.control(''),
    });
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it(`should render control on the HTML`, () => {
    fixture.detectChanges();
    expect(element.getElementsByTagName('re-captcha')).toHaveLength(1);
  });
});
