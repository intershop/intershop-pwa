import { APP_BASE_HREF } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { RECAPTCHA_V3_SITE_KEY, ReCaptchaV3Service, RecaptchaLoaderService } from 'ng-recaptcha-2';
import { BehaviorSubject, of } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';

import { CaptchaFacade } from '../../facades/captcha.facade';
import { CaptchaV2Component } from '../../shared/captcha-v2/captcha-v2.component';
import { CaptchaV3Component } from '../../shared/captcha-v3/captcha-v3.component';

import { LazyCaptchaComponent } from './lazy-captcha.component';

describe('Lazy Captcha Component', () => {
  let fixture: ComponentFixture<LazyCaptchaComponent>;
  let component: LazyCaptchaComponent;
  let element: HTMLElement;
  let captchaVersion$: BehaviorSubject<2 | 3>;
  let captchaFacade: CaptchaFacade;

  beforeEach(async () => {
    captchaVersion$ = new BehaviorSubject<2 | 3>(3);
    captchaFacade = {
      captchaActive$: jest.fn(() => of(true)),
      captchaSiteKey$: of('captchaSiteKeyASDF'),
      captchaVersion$: captchaVersion$.asObservable(),
    } as unknown as CaptchaFacade;

    await TestBed.configureTestingModule({
      imports: [LazyCaptchaComponent, TranslateModule.forRoot()],
      providers: [
        {
          provide: AppFacade,
          useValue: { appBecameStable$: of(true), icmBaseUrl: 'https://example.org' } as Partial<AppFacade>,
        },
        {
          provide: RecaptchaLoaderService,
          useValue: {
            ready: of({
              render: () => 0,
              reset: () => undefined,
              getResponse: () => '',
            }),
          },
        },
        {
          provide: ReCaptchaV3Service,
          useValue: { execute: jest.fn(() => of('captcha-v3-token')) },
        },
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: CaptchaFacade, useValue: captchaFacade },
        { provide: RECAPTCHA_V3_SITE_KEY, useValue: 'captchaSiteKeyQWERTY' },
        provideRouter([]),
      ],
    }).compileComponents();
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
    captchaVersion$.next(2);
    (captchaFacade.captchaActive$ as jest.Mock).mockReturnValue(of(true));

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
    captchaVersion$.next(3);
    (captchaFacade.captchaActive$ as jest.Mock).mockReturnValue(of(true));

    fixture.detectChanges();

    // Wait for the dynamic import to complete
    await new Promise(resolve => setTimeout(resolve, 100));
    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(`
      <ish-captcha-v3
        ><p data-testing-id="recaptcha-v3-info" class="validation-message">
          recaptcha.v3.info_text
        </p></ish-captcha-v3
      >
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
