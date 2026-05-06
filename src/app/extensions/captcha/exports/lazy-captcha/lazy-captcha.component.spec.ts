import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { MockDirective } from 'ng-mocks';
import { RECAPTCHA_V3_SITE_KEY, ReCaptchaV3Service, RecaptchaLoaderService } from 'ng-recaptcha-2';
import { of } from 'rxjs';
import { anyString, instance, mock, when } from 'ts-mockito';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { AppFacade } from 'ish-core/facades/app.facade';

import { CaptchaFacade } from '../../facades/captcha.facade';
import { CaptchaV2Component, CaptchaV2ComponentModule } from '../../shared/captcha-v2/captcha-v2.component';
import { CaptchaV3Component, CaptchaV3ComponentModule } from '../../shared/captcha-v3/captcha-v3.component';

import { LazyCaptchaComponent } from './lazy-captcha.component';

describe('Lazy Captcha Component', () => {
  let fixture: ComponentFixture<LazyCaptchaComponent>;
  let component: LazyCaptchaComponent;
  let element: HTMLElement;
  let captchaFacade: CaptchaFacade;
  let appFacade: AppFacade;

  beforeEach(async () => {
    captchaFacade = mock(CaptchaFacade);
    appFacade = mock(AppFacade);
    when(captchaFacade.captchaVersion$).thenReturn(of(3 as const));
    when(captchaFacade.captchaSiteKey$).thenReturn(of('captchaSiteKeyASDF'));
    when(captchaFacade.captchaActive$(anyString())).thenReturn(of(true));
    when(appFacade.appBecameStable$).thenReturn(of(true));

    await TestBed.configureTestingModule({
      providers: [
        { provide: AppFacade, useFactory: () => instance(appFacade) },
        { provide: CaptchaFacade, useFactory: () => instance(captchaFacade) },
      ],
    })
      .overrideModule(CaptchaV2ComponentModule, { set: { declarations: [CaptchaV2Component] } })
      .overrideModule(CaptchaV3ComponentModule, {
        set: {
          imports: [TranslateModule.forRoot()],
          declarations: [CaptchaV3Component, MockDirective(ServerHtmlDirective)],
          providers: [
            { provide: RECAPTCHA_V3_SITE_KEY, useValue: 'captchaSiteKeyQWERTY' },
            { provide: ReCaptchaV3Service },
            { provide: RecaptchaLoaderService },
          ],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LazyCaptchaComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.form = new FormGroup({
      captcha: new FormControl(''),
      captchaAction: new FormControl(''),
    });
    component.cssClass = 'd-none';
    component.topic = 'register';
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render v2 component when configured', async () => {
    when(captchaFacade.captchaVersion$).thenReturn(of(2 as const));
    when(captchaFacade.captchaActive$('register')).thenReturn(of(true));

    fixture.detectChanges();

    // Wait for the dynamic import to complete
    await new Promise(resolve => setTimeout(resolve, 100));
    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(`
      <ish-captcha-v2
        ><div>
          <div ng-reflect-ng-class="d-none" class="d-none">
            <re-captcha
              class="captcha"
              ng-reflect-site-key="captchaSiteKeyASDF"
              id="ngrecaptcha-0"
            ></re-captcha>
          </div></div
      ></ish-captcha-v2>
    `);
    const v2Cmp: CaptchaV2Component = fixture.debugElement.query(By.css('ish-captcha-v2'))?.componentInstance;
    expect(v2Cmp).toBeTruthy();
    expect(v2Cmp.cssClass).toEqual('d-none');
  });
  it('should render v3 component when configured', async () => {
    when(captchaFacade.captchaVersion$).thenReturn(of(3 as const));
    when(captchaFacade.captchaActive$('register')).thenReturn(of(true));

    fixture.detectChanges();

    // Wait for the dynamic import to complete
    await new Promise(resolve => setTimeout(resolve, 100));
    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(`
      <ish-captcha-v3
        ><p
          data-testing-id="recaptcha-v3-info"
          class="validation-message"
          ng-reflect-ish-server-html="recaptcha.v3.info_text"
        ></p
      ></ish-captcha-v3>
    `);
    const v3Cmp: CaptchaV3Component = fixture.debugElement.query(By.css('ish-captcha-v3'))?.componentInstance;
    expect(v3Cmp).toBeTruthy();
  });

  // errors are thrown if required input parameters are missing
  it('should throw an error if there is no form set as input parameter', () => {
    component.form = undefined;
    expect(() => fixture.detectChanges()).toThrowErrorMatchingInlineSnapshot(
      `"required input parameter <form> is missing for LazyCaptchaComponent"`
    );
  });

  it('should throw an error if there is no control "captcha" in the given form', () => {
    component.form = component.form as FormGroup;
    delete component.form.controls.captcha;
    expect(() => fixture.detectChanges()).toThrowErrorMatchingInlineSnapshot(
      `"form control 'captcha' does not exist in the given form for LazyCaptchaComponent"`
    );
  });

  it('should throw an error if there is no control "captchaAction" in the given form', () => {
    component.form = component.form as FormGroup;
    delete component.form.controls.captchaAction;
    expect(() => fixture.detectChanges()).toThrowErrorMatchingInlineSnapshot(
      `"form control 'captchaAction' does not exist in the given form for LazyCaptchaComponent"`
    );
  });
});
