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
import { SelectCountryComponent } from './components/form-controls/select-country/select-country.component';
import { SelectComponent } from './components/form-controls/select/select.component';
import { FormControlFeedbackComponent } from './components/global-form-validation/form-control-feedback.component';
import { ShowFormFeedbackDirective } from './directives/show-form-feedback.directive';
import { CountryService } from './services/countries/country.service';
import { RegionService } from './services/countries/region.service';

import { SelectLanguageComponent } from './components/form-controls/select-language/select-language.component';
import { SelectRegionComponent } from './components/form-controls/select-region/select-region.component';
import { SelectSecurityQuestionComponent } from './components/form-controls/select-security-question/select-security-question.component';
import { SelectTitleComponent } from './components/form-controls/select-title/select-title.component';

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
    SelectComponent,
    SelectCountryComponent,
    SelectTitleComponent,
    SelectRegionComponent,
    SelectSecurityQuestionComponent,
    SelectLanguageComponent,
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
    InputComponent,
    SelectComponent,
    SelectCountryComponent,
    SelectTitleComponent,
    SelectSecurityQuestionComponent,
    SelectLanguageComponent,
    SelectRegionComponent,
    BreadcrumbComponent,
    FormControlFeedbackComponent,
    ShowFormFeedbackDirective,
  ],
  providers: [
    CountryService,
    RegionService
  ]
})
export class SharedModule { }
