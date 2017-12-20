import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { InputComponent } from './components/form-controls/input/input.component';
import { SelectComponent } from './components/form-controls/select/select.component';
import { FormControlErrorComponent } from './components/global-form-validation/form-control-error.component';
import { FormGroupValidationComponent } from './components/global-form-validation/form-group-validation.component';
import { FormValidationDirective } from './directives/form-validation.directive';

@NgModule({
  imports: [
    RouterModule,
    TranslateModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BsDropdownModule,
    CarouselModule,
    CollapseModule,
    ModalModule,
    PopoverModule,
  ],
  declarations: [
    FormGroupValidationComponent,
    FormControlErrorComponent,
    FormValidationDirective,
    InputComponent,
    SelectComponent,
    BreadcrumbComponent
  ],
  exports: [
    RouterModule,
    TranslateModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BsDropdownModule,
    CarouselModule,
    CollapseModule,
    ModalModule,
    PopoverModule,
    FormGroupValidationComponent,
    FormValidationDirective,
    InputComponent,
    SelectComponent,
    BreadcrumbComponent
  ],
  entryComponents: [
    FormControlErrorComponent
  ]
})

export class SharedModule { }
