import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { MockComponent } from 'ng-mocks';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { configurationReducer } from 'ish-core/store/configuration/configuration.reducer';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { CaptchaV2Component } from 'ish-shared/forms/components/captcha-v2/captcha-v2.component';
import { CaptchaV3Component } from 'ish-shared/forms/components/captcha-v3/captcha-v3.component';

import { CaptchaComponent } from './captcha.component';

describe('Captcha Component', () => {
  let fixture: ComponentFixture<CaptchaComponent>;
  let component: CaptchaComponent;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CaptchaComponent, MockComponent(CaptchaV2Component), MockComponent(CaptchaV3Component)],
      imports: [
        FeatureToggleModule,
        ngrxTesting({
          reducers: { configuration: configurationReducer },
          config: {
            initialState: { configuration: { features: ['captchaV2'] } },
          },
        }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaptchaComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.form = new FormGroup({
      captcha: new FormControl(''),
      captchaAction: new FormControl(''),
    });
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element).toMatchInlineSnapshot(`
      <ish-captcha-v2
        ng-reflect-control-name="captcha"
        ng-reflect-css-class="offset-md-4 col-md-8"
      ></ish-captcha-v2>
    `);
  });

  // errors are thrown if required input parameters are missing
  it('should throw an error if there is no form set as input parameter', () => {
    component.form = undefined;
    expect(() => fixture.detectChanges()).toThrowErrorMatchingInlineSnapshot(
      `"required input parameter <form> is missing for FormElementComponent"`
    );
  });

  it('should throw an error if there is no control with controlName in the given form', () => {
    component.controlName = 'xxx';
    expect(() => fixture.detectChanges()).toThrowErrorMatchingInlineSnapshot(
      `"input parameter <controlName> with value 'xxx' does not exist in the given form for CaptchaComponent"`
    );
  });

  it('should throw an error if there is no control with actionControlName in the given form', () => {
    component.actionControlName = 'xxx';
    expect(() => fixture.detectChanges()).toThrowErrorMatchingInlineSnapshot(
      `"input parameter <controlName> with value 'xxx' does not exist in the given form for CaptchaComponent"`
    );
  });
});
