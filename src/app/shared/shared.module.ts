import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { FormElementComponent } from './components/form-controls/form-element/form-element.component';
import { InputComponent } from './components/form-controls/input/input.component';
import { SelectComponent } from './components/form-controls/select/select.component';
import { FormControlErrorComponent } from './components/global-form-validation/form-control-error.component';
import { FormGroupValidationComponent } from './components/global-form-validation/form-group-validation.component';
import { FormValidationDirective } from './directives/form-validation.directive';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PopoverModule
  ],
  declarations: [
    FormGroupValidationComponent,
    FormControlErrorComponent,
    FormElementComponent,
    FormValidationDirective,
    InputComponent,
    SelectComponent,
  ],
  entryComponents: [FormControlErrorComponent],
  providers: [],
  exports: [
    TranslateModule,
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    FormGroupValidationComponent,
    FormValidationDirective,
    InputComponent,
    SelectComponent,
    PopoverModule
  ],
})
export class SharedModule { }
