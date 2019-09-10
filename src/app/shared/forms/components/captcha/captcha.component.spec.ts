import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RecaptchaModule } from 'ng-recaptcha';

import { CAPTCHA_SITE_KEY } from 'ish-core/configurations/injection-keys';

import { CaptchaComponent } from './captcha.component';

describe('Captcha Component', () => {
  let fixture: ComponentFixture<CaptchaComponent>;
  let component: CaptchaComponent;
  let element: HTMLElement;
  const captchaSiteKey = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CaptchaComponent],
      imports: [RecaptchaModule.forRoot(), TranslateModule.forRoot()],
      providers: [{ provide: CAPTCHA_SITE_KEY, useValue: captchaSiteKey }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaptchaComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it(`should render controls on the HTML`, () => {
    fixture.detectChanges();
    const elem = element.getElementsByTagName('re-captcha');
    expect(elem).toHaveLength(1);
  });
});
