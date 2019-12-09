import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { RecaptchaModule, RecaptchaV3Module } from 'ng-recaptcha';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { IconModule } from 'ish-core/icon.module';

import { CaptchaV2Component } from './components/captcha-v2/captcha-v2.component';
import { CaptchaV3Component } from './components/captcha-v3/captcha-v3.component';
import { CaptchaComponent } from './components/captcha/captcha.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { CounterComponent } from './components/counter/counter.component';
import { FormControlFeedbackComponent } from './components/form-control-feedback/form-control-feedback.component';
import { InputBirthdayComponent } from './components/input-birthday/input-birthday.component';
import { InputComponent } from './components/input/input.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { SelectAddressComponent } from './components/select-address/select-address.component';
import { SelectCountryComponent } from './components/select-country/select-country.component';
import { SelectLanguageComponent } from './components/select-language/select-language.component';
import { SelectRegionComponent } from './components/select-region/select-region.component';
import { SelectSecurityQuestionComponent } from './components/select-security-question/select-security-question.component';
import { SelectTitleComponent } from './components/select-title/select-title.component';
import { SelectYearMonthComponent } from './components/select-year-month/select-year-month.component';
import { SelectComponent } from './components/select/select.component';
import { TextareaComponent } from './components/textarea/textarea.component';
import { ShowFormFeedbackDirective } from './directives/show-form-feedback.directive';

const declaredComponents = [CaptchaV2Component, CaptchaV3Component];

const exportedComponents = [
  CaptchaComponent,
  CheckboxComponent,
  CounterComponent,
  FormControlFeedbackComponent,
  InputBirthdayComponent,
  InputComponent,
  LoginFormComponent,
  SelectAddressComponent,
  SelectComponent,
  SelectCountryComponent,
  SelectLanguageComponent,
  SelectRegionComponent,
  SelectSecurityQuestionComponent,
  SelectTitleComponent,
  SelectYearMonthComponent,
  ShowFormFeedbackDirective,
  TextareaComponent,
];
@NgModule({
  imports: [
    CommonModule,
    FeatureToggleModule,
    IconModule,
    ReactiveFormsModule,
    RecaptchaModule,
    RecaptchaV3Module,
    RouterModule,
    TranslateModule,
  ],
  declarations: [...declaredComponents, ...exportedComponents],
  exports: [...exportedComponents],
})
export class FormsSharedModule {}
