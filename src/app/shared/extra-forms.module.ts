import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SelectCountryComponent } from './components/form-controls/select-country/select-country.component';
import { SelectLanguageComponent } from './components/form-controls/select-language/select-language.component';
import { SelectRegionComponent } from './components/form-controls/select-region/select-region.component';
import { SelectSecurityQuestionComponent } from './components/form-controls/select-security-question/select-security-question.component';
import { SelectTitleComponent } from './components/form-controls/select-title/select-title.component';
import { AddressDEComponent } from './components/forms/address-form/address-de/address-de.component';
import { AddressDefaultComponent } from './components/forms/address-form/address-default/address-default.component';
import { AddressFormComponent } from './components/forms/address-form/address-form.component';
import { AddressFRComponent } from './components/forms/address-form/address-fr/address-fr.component';
import { AddressGBComponent } from './components/forms/address-form/address-gb/address-gb.component';
import { AddressUSComponent } from './components/forms/address-form/address-us/address-us.component';
import { SharedModule } from './shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    AddressDEComponent,
    AddressDefaultComponent,
    AddressFormComponent,
    AddressFRComponent,
    AddressGBComponent,
    AddressUSComponent,
    SelectCountryComponent,
    SelectLanguageComponent,
    SelectRegionComponent,
    SelectSecurityQuestionComponent,
    SelectTitleComponent
  ],
  exports: [
    AddressFormComponent,
    SelectCountryComponent,
    SelectLanguageComponent,
    SelectRegionComponent,
    SelectSecurityQuestionComponent,
    SelectTitleComponent
  ]
})
export class ExtraFormsModule { }
