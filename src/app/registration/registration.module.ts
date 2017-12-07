import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { InputBirthdayComponent } from './components/form-controls/input-birthday/input-birthday.component';
import { SelectLanguageComponent } from './components/form-controls/select-language/select-language.component';
import { SelectSecurityQuestionComponent } from './components/form-controls/select-security-question/select-security-question.component';
import { RegistrationRoutingModule } from './registration-routing.module';

@NgModule({
  imports: [
    RegistrationRoutingModule,
    SharedModule
  ],
  providers: [],
  declarations: [
    SelectSecurityQuestionComponent,
    SelectLanguageComponent,
    InputBirthdayComponent
  ],
  exports: [
    SelectSecurityQuestionComponent,
    SelectLanguageComponent,
    InputBirthdayComponent
  ],
})

export class RegistrationModule { }
