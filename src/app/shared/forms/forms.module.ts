import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RecaptchaModule } from 'ng-recaptcha';

import { IconModule } from 'ish-core/icon.module';

import { CaptchaComponent } from './components/captcha/captcha.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { FormControlFeedbackComponent } from './components/form-control-feedback/form-control-feedback.component';
import { InputBirthdayComponent } from './components/input-birthday/input-birthday.component';
import { InputComponent } from './components/input/input.component';
import { SelectAddressComponent } from './components/select-address/select-address.component';
import { SelectCountryComponent } from './components/select-country/select-country.component';
import { SelectLanguageComponent } from './components/select-language/select-language.component';
import { SelectRegionComponent } from './components/select-region/select-region.component';
import { SelectSecurityQuestionComponent } from './components/select-security-question/select-security-question.component';
import { SelectTitleComponent } from './components/select-title/select-title.component';
import { SelectComponent } from './components/select/select.component';
import { ShowFormFeedbackDirective } from './directives/show-form-feedback.directive';

@NgModule({
  imports: [CommonModule, IconModule, ReactiveFormsModule, RecaptchaModule, TranslateModule],
  declarations: [
    CaptchaComponent,
    CheckboxComponent,
    FormControlFeedbackComponent,
    InputBirthdayComponent,
    InputComponent,
    SelectAddressComponent,
    SelectComponent,
    SelectCountryComponent,
    SelectLanguageComponent,
    SelectRegionComponent,
    SelectSecurityQuestionComponent,
    SelectTitleComponent,
    ShowFormFeedbackDirective,
  ],
  exports: [
    CaptchaComponent,
    CheckboxComponent,
    FormControlFeedbackComponent,
    InputBirthdayComponent,
    InputComponent,
    SelectAddressComponent,
    SelectComponent,
    SelectCountryComponent,
    SelectLanguageComponent,
    SelectRegionComponent,
    SelectSecurityQuestionComponent,
    SelectTitleComponent,
    ShowFormFeedbackDirective,
  ],
})
export class FormsSharedModule {}
