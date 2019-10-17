import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RecaptchaModule } from 'ng-recaptcha';

import { CAPTCHA_SITE_KEY } from 'ish-core/configurations/injection-keys';

import { CaptchaV2Component } from './captcha-v2.component';

describe('Captcha V2 Component', () => {
  let component: CaptchaV2Component;
  let fixture: ComponentFixture<CaptchaV2Component>;
  let element: HTMLElement;
  const captchaSiteKey = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CaptchaV2Component],
      imports: [RecaptchaModule.forRoot(), TranslateModule.forRoot()],
      providers: [{ provide: CAPTCHA_SITE_KEY, useValue: captchaSiteKey }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaptchaV2Component);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
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
