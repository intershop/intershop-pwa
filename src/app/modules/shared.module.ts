import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FormControlErrorComponent } from '../components/global-form-validation/form-control-error.component';
import { FormGroupValidationComponent } from '../components/global-form-validation/form-group-validation.component';
import { FormValidationDirective } from '../directives/form-validation.directive';
import { InputComponent } from '../shared/components/form-controls/input/input.component';
import { SelectComponent } from '../shared/components/form-controls/select/select.component';

@NgModule({
  exports: [
    TranslateModule,
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    FormGroupValidationComponent,
    FormValidationDirective,
    InputComponent,
    SelectComponent
  ],
  declarations: [
    FormGroupValidationComponent,
    FormControlErrorComponent,
    FormValidationDirective,
    InputComponent,
    SelectComponent
  ],
  entryComponents: [FormControlErrorComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  providers: []
})
export class SharedModule { }
