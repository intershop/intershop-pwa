import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { InputBirthdayComponent } from './components/form-controls/input-birthday/input-birthday.component';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    InputBirthdayComponent
  ],
  exports: [
    InputBirthdayComponent
  ]
})

export class RegistrationSharedModule { }
