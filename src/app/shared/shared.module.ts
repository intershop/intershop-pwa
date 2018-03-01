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
import { FormControlFeedbackComponent } from './components/form-control-feedback/form-control-feedback.component';
import { InputComponent } from './components/form-controls/input/input.component';
import { selectComponents } from './components/form-controls/select/index';
import { LoadingComponent } from './components/loading/loading.component';
import { ModalDialogComponent } from './components/modal-dialog/modal-dialog.component';
import { ProductAttributesComponent } from './components/product-attributes/product-attributes.component';
import { ShowFormFeedbackDirective } from './directives/show-form-feedback.directive';

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
    FormControlFeedbackComponent,
    ShowFormFeedbackDirective,
    InputComponent,
    BreadcrumbComponent,
    ModalDialogComponent,
    LoadingComponent,
    ...selectComponents,
    ProductAttributesComponent
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
    InputComponent,
    BreadcrumbComponent,
    LoadingComponent,
    FormControlFeedbackComponent,
    ShowFormFeedbackDirective,
    ModalDialogComponent,
    ...selectComponents,
    ProductAttributesComponent
  ]
})
export class SharedModule { }
