import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { MockDirective } from 'ng-mocks';
import { RECAPTCHA_V3_SITE_KEY, ReCaptchaV3Service } from 'ng-recaptcha';
import { EMPTY, of } from 'rxjs';
import { anyString, instance, mock, when } from 'ts-mockito';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';

import { CaptchaFacade } from '../../facades/captcha.facade';
import { CaptchaV2Component, CaptchaV2ComponentModule } from '../../shared/captcha-v2/captcha-v2.component';
import { CaptchaV3Component, CaptchaV3ComponentModule } from '../../shared/captcha-v3/captcha-v3.component';

import { LazyCaptchaComponent } from './lazy-captcha.component';

describe('Lazy Captcha Component', () => {
  let fixture: ComponentFixture<LazyCaptchaComponent>;
  let component: LazyCaptchaComponent;
  let element: HTMLElement;
  let captchaFacade: CaptchaFacade;

  beforeEach(async () => {
    captchaFacade = mock(CaptchaFacade);
    when(captchaFacade.captchaVersion$).thenReturn(EMPTY);
    when(captchaFacade.captchaSiteKey$).thenReturn(of('captchaSiteKeyASDF'));
    when(captchaFacade.captchaActive$(anyString())).thenReturn(of(true));

    await TestBed.configureTestingModule({
      declarations: [LazyCaptchaComponent],
      providers: [{ provide: CaptchaFacade, useFactory: () => instance(captchaFacade) }],
    })
      .overrideModule(CaptchaV2ComponentModule, { set: { entryComponents: [CaptchaV2Component] } })
      .overrideModule(CaptchaV3ComponentModule, {
        set: {
          imports: [TranslateModule.forRoot()],
          declarations: [CaptchaV3Component, MockDirective(ServerHtmlDirective)],
          entryComponents: [CaptchaV3Component],
          providers: [
            { provide: RECAPTCHA_V3_SITE_KEY, useValue: 'captchaSiteKeyQWERTY' },
            { provide: ReCaptchaV3Service },
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

  it('should render v2 component when configured', fakeAsync(() => {
    when(captchaFacade.captchaVersion$).thenReturn(of(2 as 2));
    fixture.detectChanges();

    tick(500);
    expect(element).toMatchInlineSnapshot(`<ish-captcha-v2></ish-captcha-v2>`);
    const v2Cmp: CaptchaV2Component = fixture.debugElement.query(By.css('ish-captcha-v2'))?.componentInstance;
    expect(v2Cmp).toBeTruthy();
    expect(v2Cmp.cssClass).toEqual('d-none');
  }));
  it('should render v3 component when configured', fakeAsync(() => {
    when(captchaFacade.captchaVersion$).thenReturn(of(3 as 3));
    fixture.detectChanges();

    tick(500);
    expect(element).toMatchInlineSnapshot(`
      <ish-captcha-v3
        ><div class="row">
          <div class="offset-md-4 col-md-8">
            <p class="form-text" data-testing-id="recaptcha-v3-info"></p>
          </div></div
      ></ish-captcha-v3>
    `);
    const v3Cmp: CaptchaV3Component = fixture.debugElement.query(By.css('ish-captcha-v3'))?.componentInstance;
    expect(v3Cmp).toBeTruthy();
  }));

  // errors are thrown if required input parameters are missing
  it('should throw an error if there is no form set as input parameter', () => {
    component.form = undefined;
    expect(() => fixture.detectChanges()).toThrowErrorMatchingInlineSnapshot(
      `"required input parameter <form> is missing for LazyCaptchaComponent"`
    );
  });

  it('should throw an error if there is no control "captcha" in the given form', () => {
    delete component.form.controls.captcha;
    expect(() => fixture.detectChanges()).toThrowErrorMatchingInlineSnapshot(
      `"form control 'captcha' does not exist in the given form for LazyCaptchaComponent"`
    );
  });

  it('should throw an error if there is no control "captchaAction" in the given form', () => {
    delete component.form.controls.captchaAction;
    expect(() => fixture.detectChanges()).toThrowErrorMatchingInlineSnapshot(
      `"form control 'captchaAction' does not exist in the given form for LazyCaptchaComponent"`
    );
  });
});
