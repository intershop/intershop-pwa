import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { RecaptchaModule } from 'ng-recaptcha';

import { IconModule } from 'ish-core/icon.module';

import { CaptchaComponent } from './components/captcha/captcha.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
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
import { LoginFormContainerComponent } from './containers/login-form/login-form.container';
import { ShowFormFeedbackDirective } from './directives/show-form-feedback.directive';

const declaredComponents = [LoginFormComponent];

const exportedComponents = [
  CaptchaComponent,
  CheckboxComponent,
  FormControlFeedbackComponent,
  InputBirthdayComponent,
  InputComponent,
  LoginFormContainerComponent,
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
  imports: [CommonModule, IconModule, ReactiveFormsModule, RecaptchaModule, RouterModule, TranslateModule],
  declarations: [...declaredComponents, ...exportedComponents],
  exports: [...exportedComponents],
})
export class FormsSharedModule {}
