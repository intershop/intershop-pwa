import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FORMLY_CONFIG, FormlyModule as FormlyBaseModule } from '@ngx-formly/core';

import { FormsSharedModule } from 'ish-shared/forms/forms.module';

import { AddressLine1Configuration } from './configurations/address-line-1.configuration';
import { AddressLine2Configuration } from './configurations/address-line-2.configuration';
import { BudgetTypeConfiguration } from './configurations/budget-type.configuration';
import { CityConfiguration } from './configurations/city.configuration';
import { CompanyName1Configuration } from './configurations/company-name-1.configuration';
import { CompanyName2Configuration } from './configurations/company-name-2.configuration';
import { FirstNameConfiguration } from './configurations/first-name.configuration';
import { LastNameConfiguration } from './configurations/last-name.configuration';
import { PhoneHomeConfiguration } from './configurations/phone-home.configuration';
import { PostalCodeConfiguration } from './configurations/postal-code.configuration';
import { TaxationIDConfiguration } from './configurations/taxation-id.configuration';
import { TitleConfiguration } from './configurations/title.configuration';
import { FIELD_LIBRARY_CONFIGURATION, FIELD_LIBRARY_CONFIGURATION_GROUP, FieldLibrary } from './field-library';
import { registerLibraryConfigReplacementExtension } from './library-config-replacement.extension';

@NgModule({
  imports: [CommonModule, FormsSharedModule, FormlyBaseModule.forChild({})],
  providers: [
    FieldLibrary,
    { provide: FIELD_LIBRARY_CONFIGURATION, useClass: TitleConfiguration, multi: true },
    { provide: FIELD_LIBRARY_CONFIGURATION, useClass: FirstNameConfiguration, multi: true },
    { provide: FIELD_LIBRARY_CONFIGURATION, useClass: LastNameConfiguration, multi: true },
    { provide: FIELD_LIBRARY_CONFIGURATION, useClass: PhoneHomeConfiguration, multi: true },
    { provide: FIELD_LIBRARY_CONFIGURATION, useClass: CompanyName1Configuration, multi: true },
    { provide: FIELD_LIBRARY_CONFIGURATION, useClass: CompanyName2Configuration, multi: true },
    { provide: FIELD_LIBRARY_CONFIGURATION, useClass: TaxationIDConfiguration, multi: true },
    { provide: FIELD_LIBRARY_CONFIGURATION, useClass: AddressLine1Configuration, multi: true },
    { provide: FIELD_LIBRARY_CONFIGURATION, useClass: AddressLine2Configuration, multi: true },
    { provide: FIELD_LIBRARY_CONFIGURATION, useClass: PostalCodeConfiguration, multi: true },
    { provide: FIELD_LIBRARY_CONFIGURATION, useClass: CityConfiguration, multi: true },
    { provide: FIELD_LIBRARY_CONFIGURATION, useClass: BudgetTypeConfiguration, multi: true },
    {
      provide: FIELD_LIBRARY_CONFIGURATION_GROUP,
      useValue: { id: 'personalInfo', shortcutFor: ['title', 'firstName', 'lastName', 'phoneHome'] },
      multi: true,
    },
    {
      provide: FIELD_LIBRARY_CONFIGURATION_GROUP,
      useValue: { id: 'companyInfo', shortcutFor: ['companyName1', 'companyName2', 'taxationID'] },
      multi: true,
    },
    {
      provide: FORMLY_CONFIG,
      useFactory: registerLibraryConfigReplacementExtension,
      deps: [FieldLibrary],
      multi: true,
    },
  ],
})
export class FieldLibraryModule {}
