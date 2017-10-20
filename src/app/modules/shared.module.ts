import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormControlErrorComponent } from '../components/global-form-validation/form-control-error.component';
import { FormGroupValidationComponent } from '../components/global-form-validation/form-group-validation.component';
import { FormValidationDirective } from '../directives/form-validation.directive';

@NgModule({
  exports: [
    TranslateModule,
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    FormGroupValidationComponent,
    FormValidationDirective
  ],
  declarations: [
    FormGroupValidationComponent,
    FormControlErrorComponent,
    FormValidationDirective
  ],
  entryComponents: [FormControlErrorComponent],
  imports: [
    CommonModule
  ],
  providers: []
})
export class SharedModule { }
